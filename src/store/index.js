import {createStore} from 'vuex';
import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_SERVICE_URL,
});

const getDishFormat = () => [
   {name: 'Завтрак', menu: []}, {name: 'Обед', menu: []}, {name: 'Ужин', menu: []}
];

const saveToLocalStorage = (timetable) => {
   localStorage.setItem('timetable', JSON.stringify(timetable));
};

const destroyToken = () => {
   localStorage.removeItem('token');
};

const getToken = () => {
   let token = localStorage.getItem('token');
   if (!token) {
      return null;
   }

   return 'Bearer ' + token;
};

const setToken = (token) => {
   localStorage.setItem('token', token);
};

const isAuthenticated = () => {
   return !!getToken();
};

const state = {
   userEmail: null,
   userToken: null,
   people: 1,
   days: 1,
   timetable: [{dishes: getDishFormat()}],
   ingredients: [],
   dishes: [],
   menuType: 'dishes',
};

const getters = {
   dishById: state => (id) => state.dishes.find(item => item.id === id),
   dishesByGroup: state => (groupId) => state.dishes.filter(item => item.type === groupId),
   ingredientById: state => (id) => state.ingredients.find(item => +item.id === +id),
   ingredientsByGroup: state => (groupId) => state.ingredients.filter(item => item.type === groupId),
};

const actions = {
   register({commit}, data) {
      return api.post('register', data);
   },
   login({commit}, loginData) {
      return api
         .post('login', loginData)
         .then(({data}) => {
            commit('SET_USER', loginData);
            setToken(data.token);
         });
   },
   logout({commit}) {
      const headers = {
         'Authorization': getToken()
      };
      api
         .post('logout', {headers})
         .then(() => {
            commit('SET_USER', {email: null});
            destroyToken();
         });
   },
   getUserInfo({commit}) {
      if (!isAuthenticated()) {
         return;
      }

      const headers = {
         'Authorization': getToken()
      };
      api.get('user', {headers})
         .then((response) => {
            commit('SET_USER', response.data);
         });
   },
   setTimetableFromStorage({commit}) {
      const data = JSON.parse(localStorage.getItem('timetable'));
      if (data) {
         commit('SET_TIMETABLE_FROM_STORE', data);
      }
   },
   changeMenuType({commit}, type) {
      commit('CHANGE_MENU_TYPE', type);
   },
   changeDays({commit}, days) {
      commit('SET_DAYS', +days);
      commit('SET_TIMETABLE', +days);
   },
   changePeople({commit}, people) {
      commit('SET_PEOPLE', +people);
   },
   getDishes({commit}) {
      api.get('dish').then(({data}) => commit('SET_DISHES', data));
   },
   getIngredients({commit}) {
      api.get('ingredient').then(({data}) => commit('SET_INGREDIENTS', data));
   },
   saveIngredient({commit}, data) {
      api.post('ingredient', data).then(({data}) => commit('SET_INGREDIENTS', data));
   },
   addIngredientToDish({commit}, {ingredientId, dayKey, dishKey, dishId}) {
      commit('ADD_INGREDIENT_TO_DISH', {ingredientId, dayKey, dishKey, dishId});
   },
   addDish({commit}, {addedDish, dayKey, dishKey}) {
      commit('ADD_DISH', {addedDish, dayKey, dishKey});
   },
   moveDish({commit}, {moveFrom, moveTo, movedDish}) {
      const id = movedDish.id;
      commit('DELETE_DISH', {id, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey});
      commit('MOVE_DISH', {dish: movedDish, dayKey: moveTo.dayKey, dishKey: moveTo.dishKey});
   },
   sortDish({commit}, {moveFrom, sortNumber, movedDish}) {
      commit('SORT_DISH', {dish: movedDish, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey, sortNumber});
   },
   deleteDish({commit}, {id, dayKey, dishKey}) {
      commit('DELETE_DISH', {id, dayKey, dishKey});
   },
};

const mutations = {
   SET_USER(state, data) {
      state.userEmail = data.email;
   },
   CHANGE_MENU_TYPE(state, value) {
      state.menuType = value || (state.menuType === 'dishes' ? 'ingredients' : 'dishes');
   },
   SET_TIMETABLE_FROM_STORE(state, timetable) {
      state.timetable = timetable;
   },
   SET_DAYS(state, value) {
      state.days = value;
   },
   SET_PEOPLE(state, value) {
      state.people = value;
   },
   SET_DISHES(state, value) {
      state.dishes = value;
   },
   SET_INGREDIENTS(state, value) {
      state.ingredients = value;
   },
   SET_TIMETABLE(state, value) {
      const timetable = state.timetable.slice(0);
      const difference = value - timetable.length;
      if (difference > 0) {
         for (let i = 0; i < difference; i++) {
            timetable.push({dishes: getDishFormat()});
         }
      } else {
         // FIXME: удаление вероятно вредит UX (когда пользователь стирает кол-во дней)
         // timetable.splice(timetable.length + difference, -difference);
      }
      state.timetable = timetable;
   },
   ADD_DISH(state, {addedDish, dayKey, dishKey}) {
      const timetable = state.timetable.slice(0);
      timetable[dayKey].dishes[dishKey].menu.push(addedDish);
      timetable[dayKey].dishes[dishKey].menu.map((item, i) => {
         if (item.id === addedDish.id) {
            item.id = `${dayKey}_${dishKey}_${i}`;
         }
      });
      state.timetable = timetable;
      saveToLocalStorage(timetable);
   },
   MOVE_DISH(state, {dish, dayKey, dishKey}) {
      state.timetable[dayKey].dishes[dishKey].menu.push(dish);
      saveToLocalStorage(state.timetable);
   },
   SORT_DISH(state, {dish, dayKey, dishKey, sortNumber}) {
      const indexNumber = state.timetable[dayKey].dishes[dishKey].menu.indexNumber(dish);
      state.timetable[dayKey].dishes[dishKey].menu.splice(indexNumber, 1);
      state.timetable[dayKey].dishes[dishKey].menu.splice(sortNumber, 0, dish);
      saveToLocalStorage(state.timetable);
   },
   DELETE_DISH(state, {id, dayKey, dishKey}) {
      const editedMenu = state.timetable[dayKey].dishes[dishKey].menu.slice(0);
      state.timetable[dayKey].dishes[dishKey].menu = editedMenu.filter((item) => id !== item.id);
      saveToLocalStorage(state.timetable);
   },
   ADD_INGREDIENT_TO_DISH(state, {ingredientId, dayKey, dishKey, dishId}) {
      state.timetable[dayKey].dishes[dishKey].menu.map((item) => {
         if (item.id === dishId) {
            const ingredientsKeys = Object.keys(item.ingredients);
            const ingredientKey = +ingredientsKeys[ingredientsKeys.length - 1] + 1;
            item.ingredients[ingredientKey] = {id: ingredientId, quantity: 0};
         }
      });
      saveToLocalStorage(state.timetable);
   },
};

export default createStore({
   state,
   getters,
   actions,
   mutations
});
