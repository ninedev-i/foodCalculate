<template>
   <div class="layout">
      <div v-if="!isLoading" class="layout-page">
         <header class="layout-header">
            <slot name="header"></slot>
         </header>
         <main class="layout-content">
            <slot name="content"></slot>
         </main>
      </div>
      <loading-indicator v-if="isLoading" />
   </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import LoadingIndicator from '@/components/common/LoadingIndicator.vue';
import { useSettingsStore } from '@/stores/settings';

const router = useRouter();
const settingsStore = useSettingsStore();
const isLoading = computed(() => settingsStore.isLoading);
const pageWidth = computed(() => router.currentRoute.value.meta.isWithSidebar ? 'calc(100% - 262px)' : '100%');
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.layout {
   display: flex;

   ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 5px;
   }
   ::-webkit-scrollbar-thumb {
      border-radius: 10px;
   }

   ::-webkit-scrollbar-track {
      display: none;
   }

   &-header {
      width: v-bind(pageWidth);
      position: fixed;
      z-index: 10;

      @media (max-width: @mobileResolution)  {
         width: 100%;
      }
   }

   &-page {
      width: v-bind(pageWidth);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: scroll;

      @media (max-width: @mobileResolution)  {
         width: 100%;
      }

      @media print {
         width: 100%;
         height: 100%;
         position: relative;
      }

      &:hover {
         &::-webkit-scrollbar-thumb {
            background-color: @borderColor;
         }
      }

      &::-webkit-scrollbar-thumb {
         background-color: @containerBackground;
      }
   }

   &-content {
      @media (max-width: 1440px) {
         margin: 68px 12px 0;
      }

      @media (min-width: 1441px) {
         margin: 68px auto 0;
         width: 100%;
         max-width: 1135px;
      }

      @media print {
         margin: 12px;
      }
   }
}
</style>
