<template>
   <button class="plusButton">
      <svg width="30px" height="30px" viewBox="0 0 48 48">
         <path d="M24,3A21,21,0,1,0,45,24,21,21,0,0,0,24,3Z" fill="aquamarine"/>
         <path d="M32,26H16a2,2,0,0,1,0-4H32A2,2,0,0,1,32,26Z" fill="#a2a6f1"/>
         <path d="M24,34a2,2,0,0,1-2-2V16a2,2,0,0,1,4,0V32A2,2,0,0,1,24,34Z" fill="#a2a6f1"/>
      </svg>
      <span class="plusButton-caption">{{caption}}</span>
   </button>
</template>

<script>
export default {
   name: 'PlusButton',
   props: {
      caption: {
         type: String,
      }
   }
};
</script>

<style lang="less">
   .plusButton {
      cursor: pointer;
      background: none;
      border: 0;
      display: flex;
      align-items: center;

      &-caption {
         margin-left: 6px;
         font-weight: bold;
         font-family: 'Open Sans', sans-serif;
      }
   }
</style>
