<template>
   <div class="app-container">
      <div class="type">
         <config />
         <router-view />
      </div>
      <foodMenu />
   </div>
</template>

<script>
import foodMenu from '@/components/Menu.vue';
import config from '@/components/Config.vue';
import timeline from '@/components/Timeline.vue';
import {useStore} from 'vuex';
import {watchEffect} from 'vue';
import {useRouter} from 'vue-router';

export default {
   name: 'App',
   components: {
      config,
      timeline,
      foodMenu,
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

body {
   margin: 0;
}

input {
   font-family: 'Open Sans', sans-serif;
   outline: none;

   &::-webkit-input-placeholder {
      color: #a7a7a7;
   }

   &[type=number] {
      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
         -webkit-appearance: none;
         -moz-appearance: none;
         appearance: none;
         margin: 0;
      }
   }
}

a {
   text-decoration: none;

   &:visited {
      color: inherit;
   }
}

.app-container {
   font-family: 'Open Sans', sans-serif;
   color: #2c3e50;
   display: flex;
}

.type {
   width: 100%;
   flex-grow: 1;
   display: flex;
   flex-direction: column;
}
</style>
