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
import foodMenu from '@/components/Menu';
import config from '@/components/Config';
import timeline from '@/components/Timeline'

export default {
   name: 'App',
   components: {
      config,
      timeline,
      foodMenu,
   },
}
</script>

<style lang="less">
   @import (css) url('https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif');

   body {
      margin: 0;
   }

   a {
      text-decoration: none;
   }
   a:visited {
      color: inherit;
   }

   .app-container {
      font-family: 'Open Sans', sans-serif;
      color: #2c3e50;
      display: flex;

      input[type=number]::-webkit-inner-spin-button,
      input[type=number]::-webkit-outer-spin-button {
         -webkit-appearance: none;
         -moz-appearance: none;
         appearance: none;
         margin: 0;
      }
   }

   .type {
      width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
   }
</style>
