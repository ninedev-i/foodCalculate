<template>
   <common-dialog
      :is-opened="isOpened"
      :heading="`Удаление ${menuType === 'ingredients' ? 'ингредиента' : 'блюда'}`"
      @accept="deleteItem(itemId)"
   >
      Вы действительно хотите удалить {{ menuType === 'ingredients' ? 'ингредиент' : 'блюдо' }}
      <b>{{ menuType === 'ingredients' ? foodStore.ingredientById(itemId)?.title : foodStore.dishById(itemId)?.title }}</b>?
   </common-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import CommonDialog from '@/components/common/Dialog.vue';
import { useFoodStore } from '@/stores/food';

defineComponent({
   name: 'DeleteItemDialog',
});

const props = defineProps({
   itemId: {
      type: Number,
      required: true
   },
   menuType: {
      type: String,
      required: true
   }
});

const foodStore = useFoodStore();
const isOpened = ref(false);

const deleteItem = (id: number) => {
   if (props.menuType === 'dishes') {
      foodStore.deleteDishFromBase(id);
   } else {
      foodStore.deleteIngredient(id);
   }
};

onMounted(() => {
   isOpened.value = true;
});
</script>

