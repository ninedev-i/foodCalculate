<template>
   <div
      :class="`dish-container ${isMoved ? 'dish-moved' : ''}`"
      :draggable="true"
      @dragstart="dragStart"
      @dragend="dragEnd"
   >
      <div class="dish-title" :data-dish-number="dish.id">{{ dish.title }}</div>

      <div v-for="({id, quantity}, key) in dish.ingredients" :key="key" class="dish-ingredient">
         <div class="dish-ingredient-caption">
            {{ ingredientById(id).title }}, {{ Math.round(quantity * people * coefficient) }} {{ ingredientById(id).count_caption }}
         </div>
      </div>

      <div class="dish-toolbar">
         <div
            class="dish-toolbar-edit"
            title="Редактировать"
            @click="isEditDialogOpened = true"
         >
            <edit-icon />
         </div>
         <div
            class="dish-toolbar-delete"
            title="Удалить"
            @click="deleteItem"
         >
            <cross-icon />
         </div>
      </div>
   </div>

   <dish-dialog
      v-if="isEditDialogOpened"
      :dish="dish"
      :computed-id="dish.computed_id"
      :day-key="dayKey"
      :meal-key="mealKey"
      :is-edited="true"
      @close="isEditDialogOpened = false"
   />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, defineComponent, ref } from 'vue';
import CrossIcon from '@/assets/cross.svg';
import EditIcon from '@/assets/edit.svg';
import { useSettingsStore } from '@/stores/settings';
import { useFoodStore } from '@/stores/food';
const DishDialog = defineAsyncComponent(() => import('@/components/dialogs/Dish.vue'));

defineComponent({
   name: 'Dish',
});

const props = defineProps({
   dish: {
      type: Object,
      required: true,
   },
   title: String,
   dayKey: Number,
   mealKey: Number,
});

const settingsStore = useSettingsStore();
const foodStore = useFoodStore();
const coefficient = computed(() => settingsStore.coefficient);
const emit = defineEmits(['delete-item']);
const isMoved = ref(false);
const people = computed(() => settingsStore.people);
const ingredientById = computed(() => foodStore.ingredientById);
const isEditDialogOpened = ref(false);

const deleteItem = (): void => emit('delete-item');

const dragStart = (ev: DragEvent): void => {
   isMoved.value = true;
   ev.dataTransfer.setData('moveDish', JSON.stringify(props.dish));
   ev.dataTransfer.setData('moveSettings', JSON.stringify({ dayKey: props.dayKey, mealKey: props.mealKey }));
};

const dragEnd = () => isMoved.value = false;
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

   &-title {
      margin-bottom: 6px;
      font-weight: bold;
      .ellipsis();

      @media print {
         white-space: break-spaces;
      }
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
}
</style>
