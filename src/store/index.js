import {createStore} from 'vuex';
import userStore from '@/store/user';
import foodStore from '@/store/food';

const saveToLocalStorage = (days, people) => {
   localStorage.setItem('settings', JSON.stringify({days, people}));
};

const modules = {
   user: userStore,
   food: foodStore,
};

const state = () => ({
   isLoading: true,
   isShowBackground: false,
   menuType: 'dishes',
   people: 1,
   days: 1,
});

const actions = {
   setIsLoading({commit, state}, value) {
      commit('SET_IS_LOADING', value);
   },
   setSettingsFromStorage({commit}) {
      const data = JSON.parse(localStorage.getItem('settings'));
      if (data) {
         commit('SET_PEOPLE', data.people);
         commit('SET_DAYS', data.days);
      }
   },
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
         this.dispatch('setTimetable', +days);
      }
   },
   removeDay({commit, state}, dayKey) {
      commit('SET_DAYS', state.days - 1);
      this.dispatch('removeDayFromMenu', dayKey);
   },
   toggleIsShowBackground({commit, state}) {
      commit('SET_IS_SHOW_BACKGROUND', !state.isShowBackground);
   },
};

const mutations = {
   SET_IS_LOADING(state, value) {
      state.isLoading = value;
   },
   SET_IS_SHOW_BACKGROUND(state, value) {
      state.isShowBackground = value;
   },
   CHANGE_MENU_TYPE(state, value) {
      state.menuType = value || (state.menuType === 'dishes' ? 'ingredients' : 'dishes');
   },
   SET_PEOPLE(state, value) {
      state.people = value;
      saveToLocalStorage(state.days, state.people);
   },
   SET_DAYS(state, value) {
      state.days = value;
      saveToLocalStorage(state.days, state.people);
   },
};

export default createStore({
   modules,
   state,
   actions,
   mutations
});
