<template>
   <button
      :disabled="disabled"
      :class="`button button-${appearance} ${disabled ? 'button-disabled' : ''}`"
      v-bind="$attrs"
      :style="style"
   >
      <slot />
   </button>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

defineComponent({
   name: 'Button',
});

const props = defineProps({
   disabled: {
      type: Boolean,
      default: false
   },
   width: {
      type: String,
      default: '100%'
   },
   appearance: {
      type: String,
      default: 'accented'
   },
   margin: {
      type: String,
      default: 'auto'
   },
   fontSize: {
      type: String,
      default: '12px'
   },
});

const style = ref({
   width: props.width,
   margin: props.margin,
   fontSize: props.fontSize,
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.button {
   padding: 6px 12px;
   font-weight: bold;
   border-radius: 4px;
   font-family: 'Open Sans', sans-serif;

   &:focus {
      box-shadow: 1px 1px 4px @accentColor;
      outline: none;
      border: 1px solid #42eab2;
   }

   &:not(.button-disabled) {
      cursor: pointer;
   }

   &-accented {
      border: 1px solid @accentColor;
      background: @accentColor;

      &:not(.button-disabled):hover {
         background: @accentColorHovered;
      }
   }

   &-outlined {
      border: 1px solid @accentColor;
      background: none;

      &.button-disabled {
         border: 1px solid @borderColor;
      }

      &:not(.button-disabled):hover {
         background: @accentColorLight;
      }
   }
}
</style>
