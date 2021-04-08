import api from '@/utils';

const getDishFormat = () => [
   {name: 'Завтрак', menu: []}, {name: 'Обед', menu: []}, {name: 'Ужин', menu: []}
];

const saveToLocalStorage = (timetable) => {
   localStorage.setItem('timetable', JSON.stringify(timetable));
};

const state = () => ({
   timetable: [{dishes: getDishFormat()}],
   ingredients: [],
   dishes: [],
});

const getters = {
   dishById: state => (id) => state.dishes.find(item => item.id === id),
   dishesByGroup: state => (groupId) => state.dishes.filter(item => item.type === groupId),
   ingredientById: state => (id) => state.ingredients.find(item => +item.id === +id),
   ingredientsByGroup: state => (groupId) => state.ingredients.filter(item => item.type === groupId),
};

const actions = {
   setTimetableFromStorage({commit}) {
      const data = JSON.parse(localStorage.getItem('timetable'));
      if (data) {
         commit('SET_TIMETABLE_FROM_STORE', data);
      }
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
   SET_TIMETABLE_FROM_STORE(state, timetable) {
      state.timetable = timetable;
   },
   SET_DISHES(state, value) {
      state.dishes = value;
   },
   SET_INGREDIENTS(state, value) {
      state.ingredients = value;
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

const foodStore = {
   state,
   getters,
   actions,
   mutations
};

export default foodStore;
