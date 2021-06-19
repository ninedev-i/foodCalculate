<template>
   <button
      :class="`button button-${appearance}`"
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
         default: 'inherit'
      },
   },
   setup(props) {
      const style = ref({
         width: props.width,
         margin: props.margin,
         fontSize: props.fontSize,
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
   padding: 6px 12px;
   font-weight: bold;
   cursor: pointer;
   border-radius: 4px;
   font-family: 'Open Sans', sans-serif;

   &-accented {
      border: 1px solid @accentColor;
      background: @accentColor;

      &:hover {
         background: @accentColorHovered;
      }
   }

   &-outlined {
      border: 1px solid @accentColor;
      background: none;

      &:hover {
         background: @accentColorLight;
      }
   }
}
</style>
