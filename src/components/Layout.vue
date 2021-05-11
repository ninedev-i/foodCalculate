<template>
   <div class="layout">
      <div class="layout-page">
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
   </div>
</template>

<script>
export default {
   name: 'Layout'
};
</script>

<style lang="less" scoped>
@import "../assets/constants.less";

.calculateWidth {
   width: calc(100% - 220px);

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
      width: 220px;
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
