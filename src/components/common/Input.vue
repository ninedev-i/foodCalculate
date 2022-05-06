<template>
   <div class="input-container">
      <input
         :id="labelId"
         :name="name"
         :class="`${borderBottom ? 'input-borderBottom' : 'input-default'} ${className}`"
         v-bind="$attrs"
         :value="value"
         :style="style"
         @input="$emit('changeValue', $event.target.value)"
      />
      <label
         v-if="labelId && label"
         :for="labelId"
      >
         {{ label }}
      </label>
   </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

defineComponent({
   name: 'Input',
});

const props = defineProps({
   name: String,
   labelId: {
      type: String,
      default: null
   },
   label: String,
   className: String,
   borderBottom: Boolean,
   inputWidth: {
      type: String,
      default: '100%'
   },
   textAlign: {
      type: String,
      default: 'left'
   },
   padding: {
      type: String,
      default: 'inherit'
   },
   margin: {
      type: String,
      default: 'inherit'
   },
   value: {
      required: true,
   },
});

const style = ref({
   width: props.inputWidth,
   textAlign: props.textAlign,
   padding: props.padding,
   margin: props.margin,
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.input {
   &-container {
      padding: 0;
      display: flex;
      align-items: baseline;

      input {
         font-family: 'Open Sans', sans-serif;
         outline: none;
         border-radius: 2px;

         &::-webkit-input-placeholder {
            color: #a7a7a7;
         }

         &[type=number] {
            &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
               -webkit-appearance: none;
               -moz-appearance: none;
               appearance: none;
               margin: 0;
            }
         }
      }
   }

   &-borderBottom {
      .inputBorderBottom();
   }

   &-default {
      border: 1px solid @borderColor;
   }
}
</style>
