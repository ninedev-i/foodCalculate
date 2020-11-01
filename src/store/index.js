import {createStore} from 'vuex'

const getDishFormat = () => [
    {name: 'Завтрак', menu: []}, {name: 'Обед', menu: []}, {name: 'Ужин', menu: []}
];

const state = {
    people: 1,
    days: 1,
    timetable: [{dishes: getDishFormat()}],

    ingredients: [
        {
            id: 1,
            name: 'Рис',
            countCaption: 'гр'
        },
        {
            id: 2,
            name: 'Соль',
            countCaption: 'гр'
        },
        {
            id: 3,
            name: 'Сухое молоко',
            countCaption: 'гр'
        },
        {
            id: 4,
            name: 'Греча',
            countCaption: 'гр'
        },
        {
            id: 5,
            name: 'Чай рассыпной',
            countCaption: 'гр'
        },
        {
            id: 6,
            name: 'Тушенка',
            countCaption: 'г'
        },
        {
            id: 7,
            name: 'Макароны',
            countCaption: 'г'
        },
        {
            id: 8,
            name: 'Сыр плавленый',
            countCaption: 'г'
        },
    ],

    dishes: [
            {
                id: 1,
                name: 'Рисовая каша',
                groupId: 1,
                ingredients: [
                    {id: 1, quantity: 100},
                    {id: 2, quantity: 10},
                    {id: 3, quantity: 150},
                ]
            },
            {
                id: 2,
                name: 'Гречневая каша',
                groupId: 1,
                ingredients: [
                    {id: 4, quantity: 120},
                    {id: 2, quantity: 10}
                ]
            },

            {
                id: 3,
                groupId: 0,
                name: 'Чай',
                ingredients: [
                    {id: 5, quantity: 30}
                ]
            },

            {
                id: 4,
                groupId: 2,
                name: 'Макароны с тушенкой',
                ingredients: [
                    {id: 7, quantity: 90},
                    {id: 2, quantity: 10},
                    {id: 6, quantity: 30},
                ]
            },
            {
                id: 5,
                groupId: 2,
                name: 'Греча с тушенкой',
                ingredients: [
                    {id: 4, quantity: 120},
                    {id: 2, quantity: 10},
                    {id: 6, quantity: 30}
                ]
            },
            {
                id: 6,
                groupId: 2,
                name: 'Рис с тушенкой',
                ingredients: [
                    {id: 1, quantity: 120},
                    {id: 2, quantity: 10},
                    {id: 6, quantity: 30}
                ]
            },
            {
                id: 6,
                groupId: 3,
                name: 'Сырный суп',
                ingredients: [
                    {id: 7, quantity: 90},
                    {id: 8, quantity: 120},
                    {id: 2, quantity: 10},
                    {id: 6, quantity: 30}
                ]
            },

        ]
};

const getters = {
    dishById: state => (id) => state.dishes.find(item => item.id === id),
    dishesByGroup: state => (groupId) => state.dishes.filter(item => item.groupId === groupId),
    ingredientById: state => (id) => state.ingredients.find(item => item.id === id),
};

const actions = {
    changeDays({commit}, days) {
        commit('SET_DAYS', +days);
        commit('SET_TIMETABLE', +days);
    },
    changePeople({commit}, people) {
        commit('SET_PEOPLE', +people);
    },
    addDish({commit}, {addedDish, dayKey, dishKey}) {
        commit('ADD_DISH', {addedDish, dayKey, dishKey});
    },
    moveDish({commit}, {moveFrom, moveTo, movedDish}) {
        const id = movedDish.id;
        commit('DELETE_DISH', {id, dayKey: moveFrom.dayKey, dishKey: moveFrom.dishKey});
        commit('MOVE_DISH', {dish: movedDish, dayKey: moveTo.dayKey, dishKey: moveTo.dishKey});
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