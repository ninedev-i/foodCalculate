<template>
   <popup text="Распечатать">
      <icon-button
         v-once
         class="print-button"
         size="22px"
         :filled="false"
         @click="printAction"
      >
         <print-icon />
      </icon-button>
   </popup>
</template>

<script lang="ts" setup>
import IconButton from '@/components/common/IconButton.vue';
import Popup from '@/components/common/Popup.vue';
import PrintIcon from '@/assets/print.svg';

const printAction = (): void => window.print();
</script>

<style lang="less">
@import "../../assets/constants.less";

// FIXME: сделать по ховеру тень такой же темной как и у других кнопок
.print-button {
   svg {
      fill: @iconAccentedColor;
   }

   @media (max-width: @mobileResolution)  {
      display: none;
   }
}
</style>
