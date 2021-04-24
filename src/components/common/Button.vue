<template>
   <button
      class="button"
      v-bind="$attrs"
      :style="style"
   >
      <slot />
   </button>
</template>

<script>
import {ref} from 'vue';

export default {
   name: 'Button',
   props: {
      width: {
         type: String,
         default: '100%'
      },
   },
   setup(props) {
      const style = ref({
         width: props.width,
      });

      return {
         style,
      };
   },
};
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.button {
   background: @accentColor;
   border: 0;
   padding: 6px 12px;
   font-weight: bold;
   cursor: pointer;
   border-radius: 4px;

   &:hover {
      background: @accentColorHovered;
   }
}
</style>
