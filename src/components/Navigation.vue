<template>
   <div class="navigation-container">
      <nav v-once class="navigation-routes">
         <div class="navigation-logo">Еда в поход</div>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.home">Меню</router-link>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.summary">Итого</router-link>
      </nav>
      <div class="navigation-avatar">
         <common-menu :items="menuItems">
            <avatar :name="userEmail" />
         </common-menu>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import CommonMenu from '@/components/common/Menu.vue';
import Avatar from '@/components/common/Avatar.vue';
import { routes } from '@/router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const logout = () => userStore.logout();
const userEmail = computed(() => userStore.email);
const registerUrl = new URL(`${import.meta.env.VITE_OVERTOUR_URL}/auth/register`);
registerUrl.searchParams.set('redirect', window.location.origin);

const loginUrl = new URL(`${import.meta.env.VITE_OVERTOUR_URL}/auth/login`);
loginUrl.searchParams.set('redirect', window.location.origin);

const menuItems = computed(() => userEmail.value
   ? [
      { caption: 'Выйти', url: '', action: logout },
   ]
   : [
      { caption: 'Зарегистрироваться', url: registerUrl },
      { caption: 'Войти', url: loginUrl },
   ]
);
</script>

<style lang="less">
@import "../assets/constants.less";

.navigation {
   &-container {
      display: flex;
      background: @containerBackground;
      box-shadow: @boxShadowHovered;
      justify-content: space-between;
      align-items: center;

      @media print {
         display: none;
      }

      a {
         color: @fontColor;
      }
   }

   &-logo {
      font-weight: bolder;
      font-size: 18px;
      margin: 0 24px;
      white-space: nowrap;
      color: @iconAccentedColor
   }

   &-routes {
      display: flex;
      align-items: baseline;
   }

   &-link {
      height: 100%;
      padding: 12px 12px 10px 12px;
      align-items: center;
      .ellipsis();

      &:hover {
         font-weight: bold;
      }

      &-active {
         border-bottom: 4px solid @accentColor;

         &:hover {
            font-weight: normal;
            cursor: default;
         }
      }
   }

   &-avatar {
      margin: 0 12px;
   }
}
</style>
