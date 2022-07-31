<template>
   <button
      :disabled="disabled"
      :class="`button button-${appearance}`"
      v-bind="$attrs"
      :style="style"
      :type="type"
   >
      <slot />
   </button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
   disabled: {
      type: Boolean,
      default: false
   },
   type: {
      type: String,
      default: 'button'
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
});

const style = ref({
   width: props.width,
   margin: props.margin,
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.button {
   padding: 6px 12px;
   font-weight: bold;
   font-size: 12px;
   border-radius: 4px;
   font-family: 'Open Sans', sans-serif;

   &:focus {
      box-shadow: 1px 1px 4px @accentColor;
      outline: none;
      border: 1px solid #42eab2;
   }

   &:not(:disabled) {
      cursor: pointer;
   }

   &-accented {
      border: 1px solid @accentColor;
      background: @accentColor;

      &:not(:disabled):hover {
         background: @accentColorHovered;
      }
   }

   &-outlined {
      border: 1px solid @accentColor;
      background: none;

      &:disabled {
         border: 1px solid @borderColor;
      }

      &:not(:disabled):hover {
         background: @accentColorLight;
      }
   }
}
</style>
