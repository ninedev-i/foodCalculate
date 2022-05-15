<template>
   <div v-once class="navigation-container">
      <nav class="navigation-routes">
         <div class="navigation-logo">Еда в поход</div>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.profile">Профиль</router-link>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.home">Меню</router-link>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.summary">Итого</router-link>
      </nav>
   </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { routes } from '@/router';

defineComponent({
   name: 'Navigation',
});
</script>

<style lang="less">
@import "../assets/constants.less";

.navigation {
   &-container {
      display: flex;
      background: @containerBackground;
      box-shadow: @boxShadowHovered;
      justify-content: space-between;
      align-items: baseline;

      @media print {
         display: none;
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
}
</style>
