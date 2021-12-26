<template>
   <icon-button
      class="print-button"
      size="22px"
      :filled="false"
      @click="printAction"
      title="Распечатать"
   >
      <print-icon />
   </icon-button>
</template>

<script>
import IconButton from '@/components/common/IconButton.vue';
import PrintIcon from '@/assets/print.svg';

export default {
   name: 'PrintButton',
   components: {
      IconButton,
      PrintIcon,
   },
   setup() {
      const printAction = () => window.print();

      return {
         printAction
      };
   },
};
</script>

<style lang="less">
@import "../../assets/constants.less";

// FIXME: сделать по ховеру тень такой же темной как и у других кнопок
.print-button svg {
   fill: @iconAccentedColor;
}
</style>
