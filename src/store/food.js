import api from '@/utils';

const getDishFormat = () => [
   {name: 'Завтрак', menu: []}, {name: 'Обед', menu: []}, {name: 'Ужин', menu: []}
];

const saveToLocalStorage = (timetable) => {
   localStorage.setItem('timetable', JSON.stringify(timetable));
};

const state = () => ({
   timetable: [{dishes: getDishFormat()}],
   isTimetableChanged: false,
   dishes: [],
   ingredients: [],
   ingredientGroups: [
      {id: 0, name: 'Крупы'},
      {id: 1, name: 'Мучное'},
      {id: 2, name: 'Специи и приправы'},
      {id: 3, name: 'Мясное'},
      {id: 4, name: 'Овощи и фрукты'},
      {id: 5, name: 'Другое'},
   ],
   dishGroups: [
      {id: 0, name: 'Напитки'},
      {id: 1, name: 'Каши'},
      {id: 2, name: 'Второе'},
      {id: 3, name: 'Супы'},
   ],
});

const getters = {
   dishById: state => (id) => state.dishes.find(item => item.id === id),
   // FIXME: ошибка когда добавляется новое блюдо без типа
   dishesByGroup: state => (groupId) => state.dishes.filter(item => item.type === groupId),
   ingredientById: state => (id) => state.ingredients.find(item => +item.id === +id),
   ingredientsByGroup: state => (groupId) => state.ingredients.filter(item => item.type === groupId),
   getSummaryIngredients: (state, getters) => () => {
      const output = new Map();
      state.timetable
         .map(item => item.dishes).flat()
         .map(item => item.menu).flat()
         .map(item => item.ingredients).flat()
         .forEach((ingredient) => {
            if (ingredient.quantity) {
               const {title, type, count_caption: countCaption} = getters.ingredientById(ingredient.id);
               output.set(ingredient.id, {
                  ...output.get(ingredient.id),
                  ...{
                     quantity: (output.get(ingredient.id)?.quantity || 0) + ingredient.quantity,
                     title,
                     type,
                     countCaption,
                  },
               });
            }
         });

      return output;
   },
   getSummaryGrouped: (state, getters) => () => {
      const output = state.ingredientGroups.slice(0);
      output.map((group) => {
         group.items = [];
         getters.getSummaryIngredients().forEach((item) => {
            if (item.type === group.id) {
               group.items.push(item);
            }
         });
         return group;
      });
      return output;
   },
};

const actions = {
   setTimetable({commit}, data) {
      commit('SET_TIMETABLE', data);
   },
   setTimetableFromStorage({commit}, dataFromBase) {
      const data = dataFromBase || JSON.parse(localStorage.getItem('timetable'));
      if (data) {
         commit('SET_TIMETABLE_FROM_STORE', data);
      }
   },
   setIsTimetableChanged({commit}, value) {
      commit('SET_IS_TIMETABLE_CHANGED', value);
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
   async saveDish({commit}, data) {
      const dishes = await api.post('dish', data);
      commit('SET_DISHES', dishes, true);
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   addIngredientToDish({commit}, {ingredientId, dayKey, dishKey, dishId}) {
      commit('ADD_INGREDIENT_TO_DISH', {ingredientId, dayKey, dishKey, dishId});
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   addDish({commit}, {addedDish, dayKey, dishKey}) {
      commit('ADD_DISH', {addedDish, dayKey, dishKey});
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   moveDish({commit}, {moveFrom, moveTo, movedDish}) {
      const id = movedDish.id;
      commit('DELETE_DISH', {id, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey});
      commit('MOVE_DISH', {dish: movedDish, dayKey: moveTo.dayKey, dishKey: moveTo.dishKey});
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   sortDish({commit}, {moveFrom, sortNumber, movedDish}) {
      commit('SORT_DISH', {dish: movedDish, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey, sortNumber});
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   deleteDish({commit}, {id, dayKey, dishKey}) {
      commit('DELETE_DISH', {id, dayKey, dishKey});
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   updateDish({commit}, {dayKey, dishKey, dishId, dishName, ingredients}) {
      commit('UPDATE_DISH', {dayKey, dishKey, dishId, dishName, ingredients});
      commit('SET_IS_TIMETABLE_CHANGED', true);
   },
   removeDayFromMenu({commit}, dayKey) {
      commit('REMOVE_DAY_FROM_MENU', {deletedDayKey: dayKey});
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
      }
      state.timetable = timetable;
      saveToLocalStorage(timetable);
   },
   SET_TIMETABLE_FROM_STORE(state, timetable) {
      state.timetable = timetable;
   },
   SET_IS_TIMETABLE_CHANGED(state, value) {
      state.isTimetableChanged = value;
   },
   SET_DISHES(state, value, isNewDish) {
      state.dishes = value;
      if (isNewDish) {
         saveToLocalStorage(state.timetable);
      }
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
            if (!item.ingredients) {
               item.ingredients = [];
            }
         }
      });
      state.timetable = timetable;
      if (addedDish.title) {
         saveToLocalStorage(timetable);
      }
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
      if (id) {
         state.timetable[dayKey].dishes[dishKey].menu = editedMenu.filter((item) => id !== item.id);
      } else {
         // Удалим свое блюдо при отмене редактирования
         state.timetable[dayKey].dishes[dishKey].menu = editedMenu.filter((item) => item.title);
      }
      saveToLocalStorage(state.timetable);
   },
   ADD_INGREDIENT_TO_DISH(state, {ingredientId, dayKey, dishKey, dishId}) {
      state.timetable[dayKey].dishes[dishKey].menu.map((item) => {
         if (item.id === dishId && !item.ingredients.map(item => item.id).includes(ingredientId)) {
            const ingredientsKeys = Object.keys(item.ingredients);
            const ingredientKey = +ingredientsKeys[ingredientsKeys.length - 1] + 1 || 0;
            item.ingredients[ingredientKey] = {id: ingredientId, quantity: 0};
         }
      });
      saveToLocalStorage(state.timetable);
   },
   UPDATE_DISH(state, {dayKey, dishKey, dishId, dishName, ingredients}) {
      state.timetable[dayKey].dishes[dishKey].menu.map((item) => {
         if (item.id === dishId) {
            item.title = dishName;
            item.ingredients = ingredients;
         }
      });
      saveToLocalStorage(state.timetable);
   },
   REMOVE_DAY_FROM_MENU(state, {deletedDayKey}) {
      let updatedTimetable = state.timetable.slice(0);
      updatedTimetable = state.timetable.filter((day, dayKey) => {
         if (dayKey + 1 > deletedDayKey) {
            return day.dishes.map(item => {
               item.menu.map(dish => {
                  const ids = dish.id.split('_');
                  ids[0] = +ids[0] - 1;
                  dish.id = ids.join('_');
                  return dish;
               });
               return item;
            });
         } else if (dayKey + 1 < deletedDayKey) {
            return day;
         }
      });

      state.timetable = updatedTimetable;
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
