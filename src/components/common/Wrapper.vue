<template>
   <div :class="`${isShowBackground ? 'wrapper-container' : ''}`">
      <slot />
      <div :class="`${isShowBackground ? 'wrapper-background' : ''}`"></div>
   </div>
</template>

<script>
import {useStore} from 'vuex';
import {computed} from 'vue';

export default {
   name: 'Wrapper',
   setup() {
      const store = useStore();
      const isShowBackground = computed(() => store.state.isShowBackground);

      return {
         isShowBackground,
      };
   }
};
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
