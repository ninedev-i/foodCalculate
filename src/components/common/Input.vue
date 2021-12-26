<template>
   <div class="input-container">
      <input
         :id="labelId"
         :class="`${borderBottom ? 'input-borderBottom' : 'input-default'} ${className}`"
         v-bind="$attrs"
         @input="$emit('changeValue', $event.target.value)"
         :value="value"
         :style="style"
      />
      <label
         v-if="labelId && label"
         :for="labelId"
      >
         {{label}}
      </label>
   </div>
</template>

<script>
import {ref} from 'vue';

export default {
   name: 'Input',
   props: {
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
      value: {
         required: true,
      },
   },
   setup(props) {
      const style = ref({
         width: props.inputWidth,
         textAlign: props.textAlign,
         padding: props.padding,
      });

      return {
         style,
      };
   }
};
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
