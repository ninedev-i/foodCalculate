import {createStore} from 'vuex'
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
});

const getDishFormat = () => [
    {name: 'Завтрак', menu: []}, {name: 'Обед', menu: []}, {name: 'Ужин', menu: []}
];

const state = {
    people: 1,
    days: 1,
    timetable: [{dishes: getDishFormat()}],
    ingredients: [],
    dishes: []
};

const getters = {
    dishById: state => (id) => state.dishes.find(item => item.id === id),
    dishesByGroup: state => (groupId) => state.dishes.filter(item => item.type === groupId),
    ingredientById: state => (id) => state.ingredients.find(item => +item.id === +id),
};

const actions = {
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
        api.get('ingredient').then(({data}) => commit('SET_INGREDIENT', data));
    },
    addIngredient({commit}, data) {
        api.post('ingredient', data).then(({data}) => commit('SET_INGREDIENT', data));
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
}

const mutations = {
    SET_DAYS(state, value) {
        state.days = value;
    },
    SET_PEOPLE(state, value) {
        state.people = value;
    },
    SET_DISHES(state, value) {
        state.dishes = value;
    },
    SET_INGREDIENT(state, value) {
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
        })
        state.timetable = timetable;
    },
    MOVE_DISH(state, {dish, dayKey, dishKey}) {
        state.timetable[dayKey].dishes[dishKey].menu.push(dish);
    },
    SORT_DISH(state, {dish, dayKey, dishKey, sortNumber}) {
        // state.timetable[dayKey].dishes[dishKey].menu.push(dish);
        const indexNumber = state.timetable[dayKey].dishes[dishKey].menu.indexNumber(dish);
        state.timetable[dayKey].dishes[dishKey].menu.splice(indexNumber, 1);
        state.timetable[dayKey].dishes[dishKey].menu.splice(sortNumber, 0, dish)
    },
    DELETE_DISH(state, {id, dayKey, dishKey}) {
        const editedMenu = state.timetable[dayKey].dishes[dishKey].menu.slice(0);
        state.timetable[dayKey].dishes[dishKey].menu = editedMenu.filter((item) => id !== item.id);
    }
}

export default createStore({
    state,
    getters,
    actions,
    mutations
})
