<template>
   <icon-button
      class="print-button"
      size="22px"
      :filled="false"
      title="Распечатать"
      @click="printAction"
   >
      <print-icon />
   </icon-button>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import IconButton from '@/components/common/IconButton.vue';
import PrintIcon from '@/assets/print.svg';

defineComponent({
   name: 'PrintButton',
});

const printAction = (): void => window.print();
</script>

<style lang="less">
@import "../../assets/constants.less";

// FIXME: сделать по ховеру тень такой же темной как и у других кнопок
.print-button svg {
   fill: @iconAccentedColor;
}
</style>
