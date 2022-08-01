<template>
   <common-dialog
      :is-opened="isOpened"
      :heading="dish ? dish.title : 'Создание своего блюда'"
      :is-hide-actions="!isEdited"
      :is-modal="!isEdited"
      accept-caption="Сохранить"
      decline-caption="Отменить"
      :before-close="saveDish"
      @close="settingsStore.changeMenuType('dishes')"
   >
      <div class="dishDialog">
         <template v-if="!isEdited">
            <div v-for="({id, quantity}, key) in ingredients" :key="key" class="dishDialog-ingredient">
               <div class="dishDialog-ingredient-caption">
                  {{ ingredientById(id).title }}, {{ quantity }} {{ ingredientById(id).count_caption }}
               </div>
            </div>
         </template>

         <form
            v-else
            ref="form"
            @submit.prevent
            @drop="dropIngredient"
            @dragover="allowDrop"
         >
            <common-input
               v-if="!dish?.id"
               v-model="dishName"
               autofocus
               padding="6px 12px"
               class="dishDialog-titleInput"
               placeholder="Название блюда"
            />
            <common-select
               v-if="!dish?.title"
               v-model="dishType"
               class="dishDialog-select"
               :items="dishGroups"
            />
            <div v-for="({id, quantity}, key) in ingredients" :key="key" class="dishDialog-ingredient">
               <div v-if="isEdited" class="dishDialog-ingredients">
                  <span>{{ ingredientById(id).title }}</span>
                  <common-input
                     border-bottom
                     type="number"
                     autofocus
                     input-width="30px"
                     margin="0 6px"
                     :value="quantity"
                     @changeValue="(value) => handleQuantityChange(id, value)"
                  />
                  <span class="dishDialog-ingredient-caption">{{ ingredientById(id).count_caption }}/чел.</span>
                  <span class="dishDialog-ingredient-delete" @click="deleteIngredient(id)">
                     <cross-icon />
                  </span>
               </div>
            </div>
            <div v-if="!ingredients.length" class="dishDialog-ingredient-tip">Перетяните сюда ингредиенты</div>
         </form>
      </div>
   </common-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CrossIcon from '@/assets/cross.svg';
import CommonDialog from '@/components/common/Dialog.vue';
import CommonInput from '@/components/common/Input.vue';
import CommonSelect from '@/components/common/Select.vue';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';
import { Ingredient } from '@/stores/food/types';

const props = defineProps({
   computedId: String,
   dayKey: Number,
   mealKey: Number,
   dish: Object,
   isEdited: {
      type: Boolean,
      default: false
   }
});

const foodStore = useFoodStore();
const settingsStore = useSettingsStore();
const isOpened = ref(false);
const ingredientById = computed(() => foodStore.ingredientById);
const dishGroups = computed(() => foodStore.dishGroups);
const ingredients = ref(props.dish ? JSON.parse(JSON.stringify(props.dish.ingredients)) : []);
const dishName = ref('');
const form = ref(null);
const dishType = ref(0);

if (props.isEdited) {
   settingsStore.changeMenuType('ingredients');
}

const handleQuantityChange = (ingredientId: number, value: string): void => {
   ingredients.value.find((item: Ingredient) => item.id === ingredientId).quantity = +value;
};

const deleteIngredient = (id: number): void => {
   ingredients.value = ingredients.value.filter((item: Ingredient) => item.id !== String(id));
   const existedIngredients = foodStore.editedDishIngredients.filter(ingredient => ingredient === id);
   foodStore.setEditedDishIngredients(existedIngredients);
};

const saveDish = (): boolean => {
   form.value.reportValidity();
   const filteredIngredients = ingredients.value.filter((item: Ingredient) => item.quantity);
   if (!filteredIngredients.length) {
      foodStore.deleteDish({
         computedId: props.computedId,
         dayKey: props.dayKey,
         mealKey: props.mealKey
      });
   } else {
      foodStore.updateDish({
         dayKey: props.dayKey,
         mealKey: props.mealKey,
         computedId: props.computedId,
         dishName: dishName.value,
         ingredients: filteredIngredients
      });
   }

   settingsStore.changeMenuType('dishes');
   foodStore.setEditedDishIngredients([]);

   return true;
};

const allowDrop = (ev: DragEvent) => ev.preventDefault();

const dropIngredient = (ev: DragEvent): void => {
   if (ev.dataTransfer.types[0] !== 'addingredient') {
      return;
   }
   const ingredientId = +ev.dataTransfer.getData('addIngredient');
   ingredients.value = [...ingredients.value, { id: String(ingredientId), quantity: 0 }];
   foodStore.setEditedDishIngredients([...foodStore.editedDishIngredients, ingredientId]);
};

onMounted(() => {
   isOpened.value = true;
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.dishDialog {
   &-ingredient {
      color: #939393;

      &-tip {
         color: #d6d6d6;
         font-size: 14px;
      }

      &-delete {
         .toolbarItem();
         margin-left: 12px;
      }
   }

   &-titleInput {
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 16px;
   }

   &-select {
      margin-bottom: 12px;
   }

   &-ingredients {
      .ellipsis();
      display: flex;
   }
}
</style>