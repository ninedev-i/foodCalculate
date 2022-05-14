<template>
   <div class="loadingIndicator">
      <div class="loadingIndicator-wrapper">
         <loader />
         <span class="loadingIndicator-text">{{ loadingTexts[randomizer()] }}</span>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import Loader from '@/assets/loader.svg';

defineComponent({
   name: 'LoadingIndicator',
});

const loadingTexts = ['Разводим костер', 'Чистим котлы', 'Собираем хворост'];

const randomizer = (): number => Math.floor(Math.random() * (Math.ceil(loadingTexts.length - 1) - Math.floor(0) + 1));
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.loadingIndicator {
   background: @background;
   width: 100%;
   height: 100%;
   position: absolute;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   &-wrapper {
      display: flex;
      margin-bottom: 16px;
      align-items: flex-end;
   }

   &-text {
      margin-left: 12px;
      color: @iconAccentedColor;
      font-size: 20px;
   }
}
</style>
