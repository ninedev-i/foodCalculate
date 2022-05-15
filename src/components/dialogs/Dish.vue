<template>
   <common-dialog
      :is-opened="isOpened"
      :heading="dish.title"
      :is-hide-actions="true"
      accept-caption="Ок"
   >
      <div v-for="({id, quantity}, key) in dish.ingredients" :key="key" class="dish-ingredient">
         <div class="dish-ingredient-caption">
            {{ ingredientById(id).title }}, {{ quantity }} {{ ingredientById(id).count_caption }}
         </div>
      </div>
   </common-dialog>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, ref } from 'vue';
import CommonDialog from '@/components/common/Dialog.vue';
import { useFoodStore } from '@/stores/food';

defineComponent({
   name: 'DishDialog',
});

const props = defineProps({
   dishId: {
      type: Number,
      required: true
   },
});

const foodStore = useFoodStore();
const isOpened = ref(false);
const dish = computed(() => foodStore.dishById(props.dishId));
const ingredientById = computed(() => foodStore.ingredientById);

onMounted(() => {
   isOpened.value = true;
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

</style>
