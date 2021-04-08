import {createStore} from 'vuex';
import userStore from '@/store/user';
import foodStore from '@/store/food';

const modules = {
   user: userStore,
   food: foodStore,
};

const state = () => ({
   menuType: 'dishes',
   people: 1,
   days: 1,
});

const actions = {
   changeMenuType({commit}, type) {
      commit('CHANGE_MENU_TYPE', type);
   },
   changePeople({commit}, people) {
      commit('SET_PEOPLE', +people);
   },
   changeDays({commit}, days) {
      commit('SET_DAYS', +days);
      commit('SET_TIMETABLE', +days);
   },
};

const mutations = {
   CHANGE_MENU_TYPE(state, value) {
      state.menuType = value || (state.menuType === 'dishes' ? 'ingredients' : 'dishes');
   },
   SET_PEOPLE(state, value) {
      state.people = value;
   },
   SET_DAYS(state, value) {
      state.days = value;
   },
};

export default createStore({
   modules,
   state,
   actions,
   mutations
});
