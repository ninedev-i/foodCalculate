import api, {setToken, destroyToken, isAuthenticated} from '@/utils';

const state = () => ({
   email: null,
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
         });
   },
   logout({commit}) {
      api
         .post('logout')
         .then(() => {
            commit('SET_EMAIL', {email: null});
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
};

const mutations = {
   SET_EMAIL(state, data) {
      state.email = data.email;
   },
};

const userStore = {
   state,
   actions,
   mutations,
};

export default userStore;
