<template>
   <div v-once :class="`alert alert-${type}`" role="alert">
      <info-icon class="alert-icon" />
      <div><slot /></div>
   </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import InfoIcon from '@/assets/info.svg';

defineComponent({
   name: 'Alert',
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.alert {
   display: flex;
   align-items: center;
   margin: 6px 0;
   border-radius: 2px;
   padding: 6px 12px;
   font-size: 14px;
   gap: 12px;
   max-width: fit-content;

   &-info {
      background: @accentColorLight;
   }

   &-warning {
      background: #ffdb98;

      svg {
         transform: rotate(180deg);
         fill: #d38800;
      }
   }

   &-icon {
      fill: @iconAccentedColor;
      width: 20px;
      min-width: 20px;
      height: 20px;
   }
}
</style>
