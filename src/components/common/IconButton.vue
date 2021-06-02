<template>
   <button class="iconButton">
      <span :class="`${filled ? 'iconButton-icon-filled' : 'iconButton-icon-empty'}`" :style="`width: ${size}; height: ${size}`">
         <slot />
      </span>
      <span class="iconButton-caption">{{caption}}</span>
   </button>
</template>

<script>
export default {
   name: 'IconButton',
   props: {
      size: {
         type: String
      },
      filled: {
         type: Boolean,
         default: true,
      },
      caption: {
         type: String,
      },
   },
};
</script>

<style lang="less">
@import "../../assets/constants.less";

.iconButton {
   cursor: pointer;
   background: none;
   border: 0;
   display: flex;
   align-items: center;

   @media print {
      display: none;
   }

   &:hover .iconButton-icon-filled {
      filter: drop-shadow(0 0 4px rgba(4, 4, 4, 0.2));
   }

   &-icon-filled {
      fill: @iconAccentedColor;
      background: #fff;
      border-radius: 100%;
      filter: drop-shadow(0 0 10px #04040412);
   }

   &-icon-empty {
      fill: @iconColor;
      padding: 6px;
      border-radius: 100%;

      &:hover {
         cursor: pointer;
         background: #fff !important;
         box-shadow: @boxShadow;
         fill: @iconAccentedColor;
      }
   }

   &-caption {
      margin-left: 6px;
      font-weight: bold;
      font-family: 'Open Sans', sans-serif;
      color: #2c3e50;
   }
}
</style>
