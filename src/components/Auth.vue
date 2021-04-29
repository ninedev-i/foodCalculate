<template>
   <div>
      <div class="auth_main" @click="openDropdown()">{{userEmail || 'Вход'}}</div>
      <div class="auth-dropdown" v-if="isOpenDropdown">
         <form class="auth-dropdown-inputs" v-if="!userEmail">
            <Input
               type="text"
               class="auth-input"
               placeholder="Почта"
               :value="email"
               @change="(ev) => email = ev.target.value"
            />
            <Input
               type="password"
               class="auth-input"
               placeholder="Пароль"
               :value="password"
               @change="(ev) => password = ev.target.value"
            />
            <Button
               type="submit"
               @click="isLogin ? login($event) : register($event)"
            >
               {{isLogin ? 'Войти' : 'Зарегистрироваться'}}
            </Button>
            <div class="auth-toggle" @click="toggleIsLogin()">{{isLogin ? 'Зарегистрироваться' : 'Войти'}}</div>
         </form>
         <div v-else>
            <Button
               type="button"
               @click="logout()"
            >
               Выйти
            </Button>
         </div>
      </div>
   </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';

export default {
   name: 'Auth',
   components: {
      Input,
      Button,
   },
   setup() {
      const store = useStore();
      const userEmail = computed(() => store.state.user.email);

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
@import "../assets/constants.less";

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
