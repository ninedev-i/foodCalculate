<template>
   <section>
      <h1 class="profile-title">{{userEmail ? 'Профиль' : 'Авторизация'}}</h1>
      <div v-if="userEmail" class="profile-container">
         <h4>Данные профиля</h4>
         <div class="profile-content">
            <span>{{userEmail}}</span>
            <common-button
               margin="0 0 0 24px"
               width="100px"
               @click="logout()"
            >
               Выйти
            </common-button>
         </div>
      </div>
      <form class="profile-inputs" v-if="!userEmail">
         <common-input
            type="text"
            class="profile-input"
            padding="6px 12px"
            placeholder="Почта"
            :value="email"
            @change="(ev) => email = ev.target.value"
         />
         <common-input
            type="password"
            class="profile-input"
            padding="6px 12px"
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
         <div class="profile-toggle" @click="toggleIsLogin()">{{isLogin ? 'Зарегистрироваться' : 'Войти'}}</div>
      </form>

      <user-menu v-if="userEmail" />
   </section>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import CommonInput from '@/components/common/Input.vue';
import CommonButton from '@/components/common/Button.vue';
import UserMenu from '@/components/UserMenu.vue';

export default {
   name: 'Profile',
   components: {
      CommonInput,
      CommonButton,
      UserMenu,
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

.profile {
   &-title {
      margin: 0 12px 12px;
   }

   &-content {
      display: flex;
      align-items: center;
      margin: 12px 0;
   }

   &-container {
      background: @containerBackground;
      border: 1px solid @borderColorLight;
      box-shadow: @boxShadow;
      padding: 12px;
   }

   &-inputs {
      width: 200px
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