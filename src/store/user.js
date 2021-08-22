import api, {setToken, destroyToken, isAuthenticated} from '@/utils';

const state = () => ({
   email: null,
   menus: [],
});

const actions = {
   register({commit}, data) {
      return api.post('register', data);
   },
   login({commit}, loginData) {
      return api
         .post('login', loginData)
         .then(({data}) => {
            commit('SET_EMAIL', loginData);
            setToken(data.token);
            this.dispatch('getSiteData');
         });
   },
   logout({commit}) {
      api
         .post('logout')
         .then(() => {
            commit('SET_EMAIL', {email: null});
            this.dispatch('getSiteData');
            destroyToken();
         });
   },
   getUserInfo({commit}) {
      if (!isAuthenticated()) {
         return;
      }
      api.get('user')
         .then((response) => {
            commit('SET_EMAIL', response.data);
         });
   },
   getSiteData() {
      this.dispatch('getIngredients');
      this.dispatch('getDishes');
      this.dispatch('getMenus');
   },
   getMenus({commit}) {
      return api.get('menu')
         .then((response) => {
            commit('SET_MENU', response.data);
         });
   },
   addMenu({commit}, menuData) {
      return api
         .post('menu', menuData)
         .then(({data}) => {
            commit('SET_MENU', data);
         });
   },
   async updateMenu({commit}, menuData) {
      await api.put(`menu/${menuData.id}`, menuData);
      this.dispatch('setIsTimetableChanged', false);
   },
   chooseMenu({commit}, id) {
      return api
         .put(`menu/${id}/choose`)
         .then(({data}) => {
            commit('SET_MENU', data);
            const chosenData = data.find(item => item.id === id);
            this.dispatch('setTimetableFromStorage', chosenData.content);
            this.dispatch('changePeople', chosenData.settings.people);
            this.dispatch('changeDays', chosenData.settings.days);
         });
   },
   deleteMenu({commit}, id) {
      return api
         .delete(`menu/${id}`)
         .then(({data}) => {
            commit('SET_MENU', data);
         });
   },
};

const mutations = {
   SET_EMAIL(state, data) {
      state.email = data.email;
   },
   SET_MENU(state, data) {
      state.menus = data;
   },
};

const userStore = {
   state,
   actions,
   mutations,
};

export default userStore;
