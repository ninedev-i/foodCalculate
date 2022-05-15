<template>
   <div v-once class="alert" role="alert">
      <info-icon class="alert-icon" />
      {{ text }}
   </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import InfoIcon from '@/assets/info.svg';

defineComponent({
   name: 'Alert',
});

defineProps({
   text: {
      type: String,
      required: true
   },
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.alert {
   display: flex;
   align-items: center;
   background: @accentColorLight;
   margin: 6px 0;
   border-radius: 2px;
   padding: 6px 12px;
   font-size: 14px;
   gap: 12px;
   max-width: fit-content;

   &-icon {
      fill: @iconAccentedColor;
      width: 20px;
      min-width: 20px;
      height: 20px;
   }
}
</style>
