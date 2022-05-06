<template>
   <div
      :class="`dish-container ${isEdited ? 'dish-edited' : ''} ${isMoved ? 'dish-moved' : ''}`"
      :draggable="!isEdited"
      @dragstart="dragStart"
      @drop="dropIngredient($event, dayKey - 1, dishKey)"
      @dragend="dragEnd"
   >
      <div v-if="dish.title" class="dish-title" :data-dish-number="dish.id">{{ dish.title }}</div>
      <common-input
         v-else
         autofocus
         border-bottom
         class="dish-input-title"
         placeholder="Введите название блюда"
         :value="dishName"
         @changeValue="(value) => dishName = value"
      />
      <common-select
         v-if="!dish.title"
         :items="dishGroups"
         :value="dishType"
         @changeValue="(val) => dishType = val"
      />
      <div v-for="({id, quantity}, key) in editedDish.ingredients" :key="key" class="dish-ingredient">
         <div v-if="isEdited" class="dish-edited-ingredients">
            <span>{{ ingredientById(id).title }}</span>
            <common-input
               border-bottom
               type="number"
               input-width="30px"
               :value="quantity"
               @changeValue="(value) => changeInputValue(id, value)"
            />
            <span class="dish-ingredient-caption">{{ ingredientById(id).count_caption }}/чел.</span>
            <span class="dish-ingredient-delete" @click="deleteIngredient(id)">
               <cross-icon />
            </span>
         </div>
         <div v-else class="dish-ingredient-caption">
            {{ ingredientById(id).title }}, {{ quantity * people }} {{ ingredientById(id).count_caption }}
         </div>
      </div>
      <div v-if="!editedDish.ingredients.length" class="dish-ingredient-tip">Перетяните сюда ингредиенты</div>

      <div class="dish-actions">
         <common-button
            v-if="isEdited"
            width="85px"
            appearance="outlined"
            @click="cancelEdit(id)"
         >
            Отменить
         </common-button>
         <common-button
            v-if="isEdited"
            width="100px"
            margin="0 0 0 12px"
            @click="saveDish"
         >
            Сохранить
         </common-button>
      </div>

      <div class="dish-toolbar">
         <div
            v-if="!isEdited"
            class="dish-toolbar-edit"
            title="Редактировать"
            @click="editItem"
         >
            <edit-icon />
         </div>
         <div
            v-if="!isEdited"
            class="dish-toolbar-delete"
            title="Удалить"
            @click="deleteItem"
         >
            <cross-icon />
         </div>
      </div>
   </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import CommonInput from '@/components/common/Input.vue';
import CommonButton from '@/components/common/Button.vue';
import CommonSelect from '@/components/common/Select.vue';
import CrossIcon from '@/assets/cross.svg';
import EditIcon from '@/assets/edit.svg';
import { Ingredient } from '@/stores/food/types';
import { scrollToElementIfIsNotVisible } from '@/utils';
import { useSettingsStore } from '@/stores/settings';
import { useFoodStore } from '@/stores/food';

defineComponent({
   name: 'Dish',
});

const props = defineProps({
   dish: {
      type: Object,
      required: true,
   },
   dayKey: Number,
   dishKey: Number,
});

const settingsStore = useSettingsStore();
const foodStore = useFoodStore();
const emit = defineEmits(['delete-item']);
const isEdited = ref(!props.dish.title);
const isMoved = ref(false);
const people = computed(() => settingsStore.people);
const ingredientById = computed(() => foodStore.ingredientById);
const dishGroups = computed(() => foodStore.dishGroups);
const dishName = ref('');
const dishType = ref(0);
const editedDish = ref({ ...props.dish });

if (isEdited.value) {
   settingsStore.changeMenuType('ingredients');
}

const changeInputValue = (ingredientId: number, value: string): void => {
   editedDish.value.ingredients.find((item: Ingredient) => item.id === ingredientId).quantity = +value;
};

const editItem = (): void => {
   const existedIngredients = editedDish.value.ingredients.map((item: { id: string }) => +item.id);
   isEdited.value = !isEdited.value;
   settingsStore.toggleIsShowBackground();
   settingsStore.changeMenuType('ingredients');
   foodStore.setEditedDishIngredients(existedIngredients);

   // Если не помещается на экран, то скроллим к нему
   setTimeout(() => {
      scrollToElementIfIsNotVisible(
         document.querySelector('.dish-edited'),
         document.querySelector('.layout-page')
      );
   }, 100);
};

const saveDish = (): void => {
   const { dayKey, dishKey, dish } = props;

   if (!props.dish.title) {
      foodStore.saveDish({
         title: dishName.value,
         type: dishType.value,
         ingredients: JSON.stringify(editedDish.value.ingredients)
      });
   }
   foodStore.updateDish({
      dayKey,
      dishKey,
      dishId: dish.id,
      dishName: dish.title || dishName.value,
      ingredients: editedDish.value.ingredients
   });
   isEdited.value = false;
   settingsStore.toggleIsShowBackground();
   settingsStore.changeMenuType('dishes');
   foodStore.setEditedDishIngredients([]);
};

const cancelEdit = (id: string | null): void => {
   isEdited.value = !isEdited.value;
   if (!id) {
      foodStore.deleteDish({ id, dayKey: props.dayKey, dishKey: props.dishKey });
   }
   settingsStore.toggleIsShowBackground();
   settingsStore.changeMenuType('dishes');
   editedDish.value = { ...props.dish };
   foodStore.setEditedDishIngredients([]);
};

const deleteItem = (): void => emit('delete-item');

const dragStart = (ev: DragEvent): void => {
   isMoved.value = true;
   ev.dataTransfer.setData('moveDish', JSON.stringify(props.dish));
   ev.dataTransfer.setData('moveSettings', JSON.stringify({ dayKey: props.dayKey, dishKey: props.dishKey }));
};

const dragEnd = () => isMoved.value = false;

const dropIngredient = (ev: DragEvent ): void => {
   if (ev.dataTransfer.types[0] !== 'addingredient') {
      return;
   }
   const ingredientId = +ev.dataTransfer.getData('addIngredient');
   const ingredients = editedDish.value.ingredients.slice(0);
   ingredients.push({ id: String(ingredientId), quantity: 0 });
   editedDish.value = {
      ...editedDish.value,
      ingredients
   };
   foodStore.setEditedDishIngredients([...foodStore.editedDishIngredients, ingredientId]);
};

const deleteIngredient = (id: number): void => {
   editedDish.value = {
      ...editedDish.value,
      ...{ ingredients: editedDish.value.ingredients.filter((item: Ingredient) => item.id !== String(id)) }
   };
   const existedIngredients = foodStore.editedDishIngredients.filter(ingredient => ingredient === id);
   foodStore.setEditedDishIngredients(existedIngredients);
};

const router = useRouter();
router.beforeEach((to, from, next) => {
   if (isEdited.value) {
      cancelEdit(null);
   }
   next();
});

</script>

<style lang="less">
@import "../assets/constants.less";

.dish {
   &-container {
      background: @containerBackground;
      padding: 12px 12px 8px;
      position: relative;
      border: 1px solid #ececec;
      box-shadow: @boxShadow;
      cursor: move;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      @media (min-width: @largeResolution) {
         padding: 12px 18px;
      }

      &:hover {
         box-shadow: @boxShadowHovered;

         .dish-toolbar {
            display: flex;
            flex-direction: row;
         }
      }
   }

   &-moved {
      opacity: 0.3;
   }

   &-ingredient {
      color: #939393;
      font-size: 14px;

      &-caption {
         .ellipsis();
         @media print {
            white-space: break-spaces;
         }
      }

      &-tip {
         color: #d6d6d6;
         font-size: 14px;
         margin: 6px 0 12px;
      }

      &-delete {
         .toolbarItem();
         margin-left: 12px;
      }
   }

   &-input-title {
      margin-bottom: 6px;
      font-weight: bold;
      font-size: 16px;
   }

   &-edited {
      cursor: default;
      z-index: 12;
      padding: 12px;

      &-ingredients {
         .ellipsis();
         display: flex;

         input {
            height: 14px;
            margin: 2px 7px 0 !important;
            text-align: center;
            font-size: 14px;
            padding-bottom: 2px !important;
         }
      }
   }

   &-toolbar {
      position: absolute;
      top: 0;
      right: 0;
      display: none;

      &-delete {
         .toolbarItem();
      }

      &-edit{
         .toolbarItem();
      }
   }

   &-actions {
      margin-top: 12px;
      float: right;
   }

   &-title {
      margin-bottom: 6px;
      font-weight: bold;
      .ellipsis();

      @media print {
         white-space: break-spaces;
      }
   }
}
</style>
