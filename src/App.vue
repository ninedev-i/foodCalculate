<template>
   <layout>
      <template #header>
         <navigation />
      </template>
      <template #content>
         <router-view />
      </template>
   </layout>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import Navigation from '@/components/Navigation.vue';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';

const userStore = useUserStore();
const foodStore = useFoodStore();
const settingsStore = useSettingsStore();
const router = useRouter();

Promise
   .allSettled([
      userStore.getUserInfo(),
      foodStore.getIngredients(),
      foodStore.getDishes(),
      userStore.getMenus()
   ])
   .then(() => {
      foodStore.setTimetableFromStorage();
      settingsStore.setSettingsFromStorage();
      settingsStore.setIsLoading(false);
   });

router.afterEach(({ path }) => {
   const menuType = path === '/add' ? 'ingredients' : 'dishes';
   settingsStore.changeMenuType(menuType);
});
</script>

<style lang="less">
@import (css) url('https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif');
@import "./assets/constants.less";

* {
   padding: 0;
   margin: 0;
}

body {
   margin: 0;
   background: @background;
   font-family: 'Open Sans', sans-serif;
   color: @fontColor;
   overflow-x: hidden;
}

h1 {
   font-size: 1.3em;
   margin: 0 0 12px 0;
}

h5 {
   font-size: 14px;
}

a {
   text-decoration: none;

   &:visited {
      color: inherit;
   }
}
</style>
