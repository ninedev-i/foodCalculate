<template>
   <div class="layout">
      <div :class="`layout-page ${isShowBackground ? 'layout-page-isEdited' : ''}`">
         <header class="layout-header">
            <slot name="header"></slot>
         </header>
         <main class="layout-content">
            <slot name="content"></slot>
         </main>
      </div>
      <aside class="layout-sidebar">
         <slot name="sidebar"></slot>
      </aside>
      <loading-indicator />
   </div>
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import {useStore} from 'vuex';
import {computed} from 'vue';

export default {
   name: 'Layout',
   components: {
      LoadingIndicator,
   },
   setup() {
      const store = useStore();
      const isShowBackground = computed(() => store.state.isShowBackground);

      return {
         isShowBackground
      };
   }
};
</script>

<style lang="less" scoped>
@import "../assets/constants.less";

@menuWidth: 250px;

.calculateWidth {
   width: calc(100% - @menuWidth);

   @media (min-width: @largeResolution) {
      width: calc(100% - 300px);
   }
}

.layout {
   display: flex;
   width: 100%;

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
      .calculateWidth();
      position: fixed;
      z-index: 100;
   }

   &-page {
      .calculateWidth();
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: scroll;

      &-isEdited {
         overflow-y: hidden;
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
      margin: 68px 12px 0;

      @media print {
         margin: 12px;
      }
   }

   &-sidebar {
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 0;
      width: @menuWidth;
      overflow-y: scroll;
      background: @accentColor;

      &:hover {
         &::-webkit-scrollbar-thumb {
            background-color: #40d9a6;
         }
      }

      &::-webkit-scrollbar-thumb {
         background-color: @accentColor;
      }

      @media (min-width: @largeResolution) {
         width: 300px;
      }
   }
}
</style>
