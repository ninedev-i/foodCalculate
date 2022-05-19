<template>
   <common-dialog
      :is-opened="isOpened"
      heading="Настройки"
      accept-caption="Сохранить"
      decline-caption="Отмена"
      @close="closeSettings"
      @accept="updateSettings"
   >
      <div class="settingsDialog">
         <label for="people">Кол-во человек</label>
         <common-input
            v-model="editedPeople"
            type="number"
            min="1"
            max="100"
            step="1"
            padding="6px 12px"
            label-id="people"
            input-width="20px"
         />
         <label for="coefficient">Коэффициент</label>
         <common-input
            v-model="editedCoefficient"
            type="number"
            min="0.1"
            max="2"
            step="0.1"
            padding="6px 12px"
            label-id="coefficient"
            input-width="20px"
         />
      </div>
      <info-alert>Количество ингредиентов умножается на коэффициент и количество человек.</info-alert>
      <div>
         <div class="settingsDialog-header">
            <h5>Рационы</h5>
            <icon-button
               title="Добавить"
               size="26px"
               @click="addMeal"
            >
               <plus-icon />
            </icon-button>
         </div>

         <div v-for="(meal, i) in meals" :key="i">
            <div v-if="!meal.isDeleted" class="settingsDialog-mealItem">
               <span class="settingsDialog-mealItem-caption">
                  <editable-input
                     :value="meal.name"
                     @save="(value) => updateMealTitle(value, i)"
                  />
               </span>
               <button class="settingsDialog-mealItem-delete" title="Удалить" @click="deleteDeal(i)">
                  <cross-icon />
               </button>
            </div>
         </div>
      </div>
   </common-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import CrossIcon from '@/assets/cross.svg';
import PlusIcon from '@/assets/plus.svg';
import InfoAlert from '@/components/common/Alert.vue';
import CommonDialog from '@/components/common/Dialog.vue';
import CommonInput from '@/components/common/Input.vue';
import EditableInput from '@/components/common/EditableInput.vue';
import IconButton from '@/components/common/IconButton.vue';
import { useSettingsStore } from '@/stores/settings';
import { useFoodStore } from '@/stores/food';
import { UpdatedMeal } from '@/stores/food/types';

defineComponent({
   name: 'SettingsDialog',
});

const settingsStore = useSettingsStore();
const foodStore = useFoodStore();
const editedPeople = ref(settingsStore.people);
const editedCoefficient = ref(settingsStore.coefficient);
const isOpened = ref(false);
const meals = ref<UpdatedMeal[]>((() => {
   const clonedMeals: UpdatedMeal[] = JSON.parse(JSON.stringify(foodStore.timetable[0].meals));
   clonedMeals.map((item, i) => {
      delete item.menu;
      item.key = i;
      return item;
   });
   return clonedMeals;
})());

const closeSettings = () => {
   isOpened.value = false;
   editedPeople.value = settingsStore.people;
   editedCoefficient.value = settingsStore.coefficient;
};

const updateSettings = () => {
   settingsStore.changePeople(editedPeople.value);
   settingsStore.changeCoefficient(editedCoefficient.value);
   foodStore.updateMealTitle(meals.value);
   closeSettings();
};

const updateMealTitle = (name: string, key: number) => {
   meals.value = meals.value.map((meal, i) => {
      if (i === key) {
         meal.name = name;
      }
      return meal;
   });
};

const addMeal = () => {
   meals.value = [...meals.value, { name: 'Едка', isNew: true, menu: [] }];
};

const deleteDeal = (key: number) => {
   meals.value = meals.value.map((meal, i) => {
      if (i === key) {
         meal.isDeleted = true;
      }
      return meal;
   });
};

onMounted(() => {
   isOpened.value = true;
});
</script>

<style scoped lang="less">
@import "../../assets/constants.less";

.settingsDialog {
   display: flex;
   align-items: baseline;
   gap: 6px 12px;
   margin-bottom: 16px;

   &-header {
      display: flex;
      gap: 6px;
      align-items: center;
      margin: 12px 0;
   }

   &-mealItem {
      list-style: none;
      margin: 12px 0;
      display: flex;
      align-items: baseline;

      &-caption {
         padding: 4px 10px;
         box-shadow: @boxShadow;
         width: fit-content;
      }

      &-delete {
         all: unset;
         width: 10px;
         height: 10px;
         fill: @iconAccentedColor;
         margin-left: 12px;
         cursor: pointer;
      }
   }
}
</style>