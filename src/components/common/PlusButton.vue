<template>
   <button class="plusButton">
         <svg class="plusButton-icon" width="30px" height="30px" viewBox="0 0 48 48">
            <path d="M24,3A21,21,0,1,0,45,24,21,21,0,0,0,24,3Z" fill="#fff" />
            <path d="M32,26H16a2,2,0,0,1,0-4H32A2,2,0,0,1,32,26Z" fill="#a2a6f1" />
            <path v-if="!isDelete" d="M24,34a2,2,0,0,1-2-2V16a2,2,0,0,1,4,0V32A2,2,0,0,1,24,34Z" fill="#a2a6f1" />
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
      },
      isDelete: {
         type: Boolean,
         default: false,
      }
   },
};
</script>

<style lang="less">
@import "../../assets/constants.less";

.plusButton {
   cursor: pointer;
   background: none;
   border: 0;
   display: flex;
   align-items: center;

   @media print {
      display: none;
   }

   &:hover .plusButton-icon {
      filter: drop-shadow(0 0 4px rgba(4, 4, 4, 0.2));
   }

   &-icon {
      filter: drop-shadow(0 0 10px #04040412);
   }

   &-caption {
      margin-left: 6px;
      font-weight: bold;
      font-family: 'Open Sans', sans-serif;
      color: #2c3e50;
   }
}
</style>
