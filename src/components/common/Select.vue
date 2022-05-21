<template>
   <select
      v-model="selectedValue"
      class="select"
      @change="$emit('update:modelValue', selectedValue);"
      >
      <option v-for="option in items" :key="option.id" :value="option.id">{{ option.name }}</option>
   </select>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineEmits(['update:modelValue']);

const props = defineProps({
   items: {
      type: Array,
   },
   modelValue: {
      type: Number,
      default: 0
   }
});

const selectedValue = ref(props.modelValue);
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
