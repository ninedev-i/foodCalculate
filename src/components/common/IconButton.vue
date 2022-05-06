<template>
   <button class="iconButton" :disabled="disabled">
      <span
         :class="`${filled ? 'iconButton-icon-filled' : 'iconButton-icon-empty'}
         ${rounded ? 'iconButton-icon-rounded' : ''}`"
         :style="`width: ${size}; height: ${size}`"
>
         <slot />
      </span>
      <span class="iconButton-caption">{{ caption }}</span>
   </button>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue';

defineComponent({
   name: 'IconButton',
});

const props = defineProps({
   size: {
      type: String
   },
   disabled: {
      type: Boolean,
      default: false
   },
   filled: {
      type: Boolean,
      default: true,
   },
   rounded: {
      type: Boolean,
      default: true,
   },
   caption: {
      type: String,
   },
});

const backgroundColor = computed(() => props.disabled ? 'none' : '#fff');
const boxShadow = computed(() => props.disabled ? 'none' : '0 2px 8px 0 #04040412');
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
      filter: drop-shadow(0 0 10px #04040412);
   }

   &-icon-rounded {
      border-radius: 100%;
   }

   &-icon-empty {
      fill: @iconColor;
      padding: 6px;
      border-radius: 100%;

      &:hover {
         cursor: pointer;
         background: v-bind(backgroundColor) !important;
         box-shadow: v-bind(boxShadow);
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
