<template>
   <select
      v-model="selectedValue"
      class="select"
      @change="$emit('changeValue', value);"
      >
      <option v-for="option in items" :key="option.id" :value="option.id">{{ option.name }}</option>
   </select>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';

defineComponent({
   name: 'Select',
});

defineEmits(['changeValue']);

const props = defineProps({
   items: {
      type: Array,
   },
   value: {
      type: Number,
      default: 0
   }
});

const selectedValue = ref(props.value);
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.select {
   width: 100%;
   border: 1px solid @accentColor;
   border-radius: 2px;
   padding: 6px;
   cursor: pointer;
   background-color: #fff;

   &:focus,
   &:focus-visible,
   &:active {
      border: 1px solid @accentColor;
      outline: none;
   }
}
</style>
