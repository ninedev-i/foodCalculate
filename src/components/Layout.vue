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
      cursor: pointer;
   }
   ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      cursor: pointer !important;
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
      overflow: scroll;

      &::-webkit-scrollbar-thumb {
         background-color: @borderColor;
      }
   }

   &-content {
      margin: 56px 12px 0;
   }

   &-sidebar {
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 0;
      width: 220px;
      overflow: scroll;
      background: @accentColor;

      &::-webkit-scrollbar-thumb {
         background-color: #40d9a6;
      }

      @media (min-width: @largeResolution) {
         width: 300px;
      }
   }
}
</style>
