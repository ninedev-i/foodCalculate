<template>
   <section>
      <h1 class="profile-title">{{ userEmail ? 'Профиль' : 'Авторизация' }}</h1>
      <div v-if="userEmail" class="profile-container">
         <h4 class="profile-subTitle">Данные профиля</h4>
         <div class="profile-content">
            <span>{{ userEmail }}</span>
            <common-button
               margin="0 0 0 24px"
               width="100px"
               @click="logout()"
            >
               Выйти
            </common-button>
         </div>
      </div>
      <form v-if="!userEmail" class="profile-form" @submit.prevent="isLogin ? login() : register()">
         <h4 class="profile-subTitle">{{ isLogin ? 'Войти' : 'Зарегистрироваться' }}</h4>
         <div class="profile-authWrapper">
            <div class="profile-inputs">
               <common-input
                  v-model="email"
                  name="email"
                  type="text"
                  class="profile-input"
                  padding="6px 12px"
                  margin="0 0 6px"
                  placeholder="Почта"
                  :autofocus="true"
                  @changeValue="resetError"
               />
               <common-input
                  v-model="password"
                  name="password"
                  type="password"
                  class="profile-input"
                  padding="6px 12px"
                  margin="0 0 6px"
                  placeholder="Пароль"
                  @changeValue="resetError"
               />
               <div class="profile-error">{{ error }}</div>
               <common-button
                  margin="12 0 0"
                  type="submit"
               >
                  {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
               </common-button>
               <div class="profile-toggleContainer">
                  <span v-if="isLogin">Еще нет аккаунта?</span>
                  <span class="profile-toggle" @click="toggleIsLogin()">{{ isLogin ? 'Зарегистрируйтесь' : 'Уже есть аккаунт' }}</span>
               </div>
            </div>
            <div>
               <b class="profile-subTitle">Зачем мне аккаунт?</b>
               <ul class="profile-registerDetails">
                  <li>Возможность сохранять меню</li>
                  <li>Можно добавлять свои блюда и ингредиенты</li>
                  <li>Контроль за изменениями</li>
                  <li>Cоздание нескольких меню</li>
               </ul>
            </div>
         </div>
      </form>

      <user-menu v-if="userEmail" />
   </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import CommonInput from '@/components/common/Input.vue';
import CommonButton from '@/components/common/Button.vue';
import UserMenu from '@/components/dialogs/UserMenu.vue';

const userStore = useUserStore();
const userEmail = computed(() => userStore.email);

const email = ref('');
const password = ref('');
const isLogin = ref(true);
const error = ref('');

const toggleIsLogin = () => isLogin.value = !isLogin.value;

const register = () => {
   if (!email.value || !password.value) {
      return;
   }
   userStore
      .register({
         email: email.value,
         password: password.value,
         password_confirmation: password.value,
      })
      .then(() => login())
      .catch(({ response }) => {
         const { status, data } = response;
         if (status === 422 && data.errors[0].rule === 'unique') {
            error.value = 'Пользователь с таким email уже существует';
         }
      });
};

const login = () => {
   if (!email.value || !password.value) {
      return;
   }
   userStore
      .login({
         email: email.value,
         password: password.value,
      })
      .catch(({ response }) => {
         const { status } = response;
         if (status === 400) {
            error.value = 'Неверная почта или пароль';
         }
      });
};

const resetError = () => {
   if (error.value) {
      error.value = '';
   }
};

const logout = () => userStore.logout();
</script>

<style lang="less">
@import "../assets/constants.less";

.profile {
   &-title {
      margin: 0 12px 12px;
   }

   &-subTitle {
      margin-bottom: 12px;
   }

   &-registerDetails {
      margin-top: 12px;
      font-size: 14px;
      list-style-position: inside;
   }

   &-content {
      display: flex;
      align-items: center;
      margin: 12px 0;
   }

   &-container {
      .container();
   }

   &-authWrapper {
      display: flex;
      gap: 30px;

      @media (max-width: @mobileResolution)  {
         flex-direction: column;
      }
   }

   &-form {
      .container();
   }

   &-inputs {
      width: 300px;
   }

   &-input {
      padding: 4px 6px;
      margin-bottom: 2px;
   }

   &-toggleContainer {
      width: 100%;
      justify-content: center;
      font-size: 13px;
      display: inline-flex;
      gap: 10px;
      align-items: baseline;
   }

   &-toggle {
      color: #0bafca;
      text-decoration: underline;
      text-align: center;
      margin-top: 6px;
      cursor: pointer;
      &:hover {
         color: @linkColor;
      }
   }

   &-error {
      font-size: 13px;
      margin-bottom: 12px;
      color: #f00000;
      text-align: center;
   }
}
</style>
