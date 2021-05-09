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
      if (people > 0) {
         commit('SET_PEOPLE', +people);
      }

   },
   changeDays({commit}, days) {
      if (days > 0 && days <= 500) {
         commit('SET_DAYS', +days);
         commit('SET_TIMETABLE', +days);
      }
   },
   removeDay({commit, state}, dayKey) {
      commit('SET_DAYS', state.days - 1);
      this.dispatch('removeDayFromMenu', dayKey);
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
