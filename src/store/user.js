import api, {setToken, destroyToken, isAuthenticated} from '@/utils';

const state = () => ({
   email: null,
   menus: [],
   menusForInput: []
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
         .then(({data}) => {
            commit('SET_MENU', data);
            commit('SET_MENUS_FOR_INPUT', data.reduce((obj, cur) => {
               const dataObject = obj ? {[obj.id]: obj.title} : {};
               return ({...dataObject, [cur.id]: cur.title});
            }));
         });
   },
   setMenusForInput({commit, state}, {value, id}) {
      const updatedData = {...state.menusForInput};
      updatedData[id] = value;
      commit('SET_MENUS_FOR_INPUT', updatedData);
   },
   addMenu({commit}, menuData) {
      return api
         .post('menu', menuData)
         .then(({data}) => {
            commit('SET_MENU', data);
            commit('SET_MENUS_FOR_INPUT', data.reduce((obj, cur) => {
               const dataObject = obj ? {[obj.id]: obj.title} : {};
               return ({...dataObject, [cur.id]: cur.title});
            }));
         });
   },
   async updateMenu({commit}, menuData) {
      const {data} = await api.put(`menu/${menuData.id}`, menuData);
      commit('SET_MENU', data);
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
            commit('SET_MENUS_FOR_INPUT', data.reduce((obj, cur) => ({...obj, [cur.id]: cur.title}), {}));
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
   SET_MENUS_FOR_INPUT(state, data) {
      state.menusForInput = data;
   },
};

const getters = {
   currentMenuTitle: state => state.menus.find(item => item.is_current)?.title
};

const userStore = {
   state,
   actions,
   getters,
   mutations,
};

export default userStore;
