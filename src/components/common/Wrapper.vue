<template>
   <div :class="`${isShowBackground ? 'wrapper-container' : ''}`">
      <slot />
      <div :class="`${isShowBackground ? 'wrapper-background' : ''}`"></div>
   </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue';
import { useSettingsStore } from '@/stores/settings';

defineComponent({
   name: 'Wrapper',
});

const settingsStore = useSettingsStore();
const isShowBackground = computed(() => settingsStore.isShowBackground);
</script>

<style lang="less" scoped>
.wrapper {
   &-container {
      overflow: hidden;
   }
   &-background {
      position: fixed;
      background: #00000080;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 1;
   }
}
</style>
