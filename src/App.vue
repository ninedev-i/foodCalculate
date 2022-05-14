<template>
   <layout>
      <template #header>
         <navigation />
      </template>
      <template #content>
         <wrapper>
            <router-view />
         </wrapper>
      </template>
   </layout>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import Layout from '@/components/common/Layout.vue';
import Navigation from '@/components/Navigation.vue';
import Wrapper from '@/components/common/Wrapper.vue';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';
import { DebuggerEventExtraInfo } from '@vue/reactivity';

defineComponent({
   name: 'App',
});

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
   .then(() => settingsStore.setIsLoading(false));

foodStore.$subscribe((mutation) => {
   const events = mutation.events as DebuggerEventExtraInfo;
   if (events.key === 'ingredients' && !events.oldValue.length && events.newValue.length) {
      foodStore.setTimetableFromStorage();
      settingsStore.setSettingsFromStorage();
   }
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

a {
   text-decoration: none;

   &:visited {
      color: inherit;
   }
}
</style>
