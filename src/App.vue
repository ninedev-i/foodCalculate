<template>
   <Layout>
      <template #header>
         <Config />
      </template>
      <template #content>
         <router-view />
      </template>
      <template #sidebar>
         <FoodMenu />
      </template>
   </Layout>
</template>

<script>
import FoodMenu from '@/components/Menu.vue';
import Config from '@/components/Config.vue';
import Layout from '@/components/Layout.vue';
import {useStore} from 'vuex';
import {watchEffect} from 'vue';
import {useRouter} from 'vue-router';

export default {
   name: 'App',
   components: {
      Config,
      FoodMenu,
      Layout,
   },
   setup() {
      const store = useStore();
      const router = useRouter();

      store.dispatch('getUserInfo');
      store.dispatch('getIngredients');
      store.dispatch('getDishes');
      const stopLoadingItemsWatcher = watchEffect(() => {
         if (store.state.food.ingredients.length && store.state.food.dishes.length) {
            store.dispatch('setTimetableFromStorage');
            store.dispatch('setSettingsFromStorage');
         }
      });
      if (store.state.food.ingredients.length && store.state.food.dishes.length) {
         stopLoadingItemsWatcher();
      }

      router.afterEach(({path}) => {
         const menuType = path === '/add' ? 'ingredients' : 'dishes';
         store.dispatch('changeMenuType', menuType);
      });
   },
};
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
