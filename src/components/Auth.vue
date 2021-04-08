<template>
   <div>
      <div class="auth_main" @click="openDropdown()">{{userEmail || 'Вход'}}</div>
   <div class="auth-dropdown" v-if="isOpenDropdown">
      <form class="auth-dropdown-inputs" v-if="!userEmail">
         <input type="text" class="auth-input" v-model="email" placeholder="Почта">
         <input type="password" class="auth-input" v-model="password" placeholder="Пароль">
         <input type="submit"
                class="auth-button"
                @click="isLogin ? login($event) : register($event)"
                :value="isLogin ? 'Войти' : 'Зарегистрироваться'"
         />
         <div class="auth-toggle" @click="toggleIsLogin()">{{isLogin ? 'Зарегистрироваться' : 'Войти'}}</div>
      </form>
      <div v-else>
         <button class="auth-button" @click="logout()">Выйти</button>
      </div>
   </div>
   </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';

export default {
   name: 'Auth',
   setup() {
      const store = useStore();
      const userEmail = computed(() => store.state.userEmail);

      const email = ref('');
      const password = ref('');
      const isLogin = ref(true);
      const isOpenDropdown = ref(false);

      const openDropdown = () => isOpenDropdown.value = !isOpenDropdown.value;
      const toggleIsLogin = () => isLogin.value = !isLogin.value;
      const register = (ev) => {
         ev.preventDefault();
         store.dispatch('register', {
            email: email.value,
            password: password.value,
            password_confirmation: password.value,
         });
      };
      const login = (ev) => {
         ev.preventDefault();
         store.dispatch('login', {
            email: email.value,
            password: password.value,
         }).then(() => {
            isOpenDropdown.value = false;
         });
      };
      const logout = () => store.dispatch('logout');

      return {
         email,
         isLogin,
         password,
         userEmail,
         isOpenDropdown,
         login,
         logout,
         register,
         openDropdown,
         toggleIsLogin,
      };
   },
};
</script>

<style lang="less">
.auth {
   &_main {
      cursor: pointer;
      text-decoration: underline;
      margin-right: 24px;
   }

   &-dropdown {
      position: absolute;
      background: #fff;
      border: 1px solid #ececec;
      padding: 12px;
      z-index: 1000;
      top: 46px;
      left: 0;
      box-shadow: 0 2px 8px 0 #04040412;

      &-inputs {
         display: flex;
         flex-direction: column;
      }
   }

   &-input {
      margin-bottom: 6px;
      padding: 4px 6px;
   }

   &-button {
      background: aquamarine;
      border: 0;
      padding: 6px 12px;
      font-weight: bold;
      cursor: pointer;
   }

   &-toggle {
      color: #0bafca;
      text-decoration: underline;
      text-align: center;
      font-size: 13px;
      margin-top: 6px;
      cursor: pointer;
      &:hover {
         color: #00a6c1;
      }
   }
}
</style>
