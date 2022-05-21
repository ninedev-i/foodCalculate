<template>
   <common-dialog
      :is-opened="isOpened"
      :heading="`Удаление ${menuType === 'ingredients' ? 'ингредиента' : 'блюда'}`"
      accept-caption="Удалить"
      decline-caption="Отмена"
      @accept="deleteItem(itemId)"
   >
      Вы действительно хотите удалить {{ menuType === 'ingredients' ? 'ингредиент' : 'блюдо' }}
      <b>{{ menuType === 'ingredients' ? foodStore.ingredientById(itemId)?.title : foodStore.dishById(itemId)?.title }}</b>?

      <warning-alert v-if="dishUsedInMenus.length && menuType === 'dishes'" type="warning">
         <div v-if="dishUsedInMenus.length === 1 && dishUsedInMenus.includes('current')">Это блюдо используется в текущем меню и будет из него удалено.</div>
         <div v-else>
            <p>Это блюдо используется в следующих меню: <b>{{ dishUsedInMenus.filter(item => item !== 'current').join(', ') }}</b>.</p>
            <p>В случае удаления, блюдо будет удалено из всех меню.</p>
         </div>
      </warning-alert>
   </common-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import CommonDialog from '@/components/common/Dialog.vue';
import WarningAlert from '@/components/common/Alert.vue';
import { useFoodStore } from '@/stores/food';

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
const dishUsedInMenus = ref([]);

if (props.menuType === 'dishes') {
   dishUsedInMenus.value = await foodStore.checkIsDishUsed(props.itemId);
}

const deleteItem = (id: number) => {
   if (props.menuType === 'dishes') {
      foodStore.deleteDishFromBase(id);
   } else {
      foodStore.deleteIngredient(id);
   }
};

onMounted(async () => {
   isOpened.value = true;
});
</script>

