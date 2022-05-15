<template>
   <div class="input-container">
      <label
         v-if="labelId && label"
         :for="labelId"
         class="input-label"
      >
         {{ label }}
      </label>
      <input
         :id="labelId"
         :autofocus="autofocus"
         :name="name"
         :class="`${borderBottom ? 'input-borderBottom' : 'input-default'} ${className}`"
         v-bind="$attrs"
         :value="value"
         required="required"
         :style="style"
         :step="step"
         @input="$emit('changeValue', $event.target.value)"
      />
   </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';

defineComponent({
   name: 'Input',
});

const props = defineProps({
   name: String,
   labelId: {
      type: String,
      default: null
   },
   autofocus: Boolean,
   label: String,
   step: String,
   className: {
      type: String,
      default: ''
   },
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

onMounted(() => {
   if (props.autofocus && props.labelId) {
      document.getElementById(props.labelId)?.focus();
   }
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

         &:focus {
            border-color: @accentColor;
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

   &-label {
      margin-right: 12px;
   }
}
</style>
