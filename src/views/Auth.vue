<template>
   <section class="auth-container">
      <h1>{{userEmail ? 'Профиль' : 'Авторизация'}}</h1>
      <div class="auth-email" v-if="userEmail">{{userEmail}}</div>
      <form class="auth-inputs" v-if="!userEmail">
         <common-input
            type="text"
            class="auth-input"
            placeholder="Почта"
            :value="email"
            @change="(ev) => email = ev.target.value"
         />
         <common-input
            type="password"
            class="auth-input"
            placeholder="Пароль"
            :value="password"
            @change="(ev) => password = ev.target.value"
         />
         <common-button
            type="submit"
            @click="isLogin ? login($event) : register($event)"
         >
            {{isLogin ? 'Войти' : 'Зарегистрироваться'}}
         </common-button>
         <div class="auth-toggle" @click="toggleIsLogin()">{{isLogin ? 'Зарегистрироваться' : 'Войти'}}</div>
      </form>
      <div v-else>
         <common-button
            class="auth-logout"
            type="button"
            @click="logout()"
         >
            Выйти
         </common-button>
      </div>
   </section>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import CommonInput from '@/components/common/Input.vue';
import CommonButton from '@/components/common/Button.vue';

export default {
   name: 'Auth',
   components: {
      CommonInput,
      CommonButton,
   },
   setup() {
      const store = useStore();
      const userEmail = computed(() => store.state.user.email);

      const email = ref('');
      const password = ref('');
      const isLogin = ref(true);

      const toggleIsLogin = () => isLogin.value = !isLogin.value;
      const register = (ev) => {
         ev.preventDefault();
         store.dispatch('register', {
            email: email.value,
            password: password.value,
            password_confirmation: password.value,
         }).then(() => login(ev));
      };
      const login = (ev) => {
         ev.preventDefault();
         store.dispatch('login', {
            email: email.value,
            password: password.value,
         }).then(() => {
            store.dispatch('getIngredients');
            store.dispatch('getDishes');
         });
      };
      const logout = () => store.dispatch('logout');

      return {
         email,
         isLogin,
         password,
         userEmail,
         login,
         logout,
         register,
         toggleIsLogin,
      };
   },
};
</script>

<style lang="less">
@import "../assets/constants.less";

.auth {
   &-container {
      margin: 0 12px;
   }

   &-email {
      cursor: pointer;
      text-decoration: underline;
      margin-right: 24px;
   }

   &-inputs {
      width: 200px
   }

   &-logout {
      margin-top: 12px;
      width: 140px !important;
      display: block;
   }

   &-input {
      padding: 4px 6px;
      margin-bottom: 2px;
   }

   &-toggle {
      color: #0bafca;
      text-decoration: underline;
      text-align: center;
      font-size: 13px;
      margin-top: 6px;
      cursor: pointer;
      &:hover {
         color: @linkColor;
      }
   }
}
</style>
