<template>
   <section class="timeline-container">
      <div class="timeline-header">
         <h1>Меню {{ currentMenu ? `«${currentMenu.title}»` : '' }}</h1>
         <list-button />
         <print-button />
         <save-button />
         <settings />
      </div>

      <div
         v-for="(dayKey) in days"
         :key="dayKey"
         class="timeline-day"
      >
         <div class="timeline-day-title">
            <span>День {{ dayKey }}</span>
            <icon-button
               v-if="dayKey !== 1"
               size="20px"
               class="timeline-day-delete"
               title="Удалить день"
               @click="removeDay(dayKey)"
            >
               <minus-icon />
            </icon-button>
         </div>

         <div class="timeline-menu">
            <div
               v-for="(meal, mealKey) in timetable[dayKey - 1]?.meals"
               :key="mealKey"
               class="timeline-menu-dish"
               @dragover="allowDrop($event, dayKey - 1, mealKey)"
               @dragleave="removeBorder($event, dayKey - 1, mealKey)"
            >
               <div class="timeline-menu-title">{{ meal.name }}</div>
               <div
                  :ref="(el) => {divs[`day_${dayKey - 1}_${mealKey}`] = el}"
                  class="timeline-menu-dishes"
                  @drop="drop($event, dayKey - 1, mealKey)"
               >
                  <div v-for="(dish, menuKey) in meal.menu" :key="menuKey" class="timeline-menu-dishes-container">
                     <div
                        v-if="menuKey === 0"
                        class="timeline-menu-dish-sortZone"
                        :data-index="menuKey"
                        @dragover="drawSortZone($event)"
                        @dragleave="removeSortZone($event)"
                        @drop="sortDish($event, menuKey)"
                     ></div>
                     <dish-item
                        :dish="dish"
                        :day-key="dayKey - 1"
                        :meal-key="mealKey"
                        @delete-item="deleteDish(dish.computed_id, dayKey - 1, mealKey)"
                     />
                     <div
                        class="timeline-menu-dish-sortZone"
                        :data-index="menuKey + 1"
                        @dragover="drawSortZone($event)"
                        @dragleave="removeSortZone($event)"
                        @drop="sortDish($event, menuKey + 1)"
                     ></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <icon-button
         class="timeline-addDay"
         caption="Добавить день"
         size="26px"
         @click="addDay"
      >
         <plus-icon />
      </icon-button>
   </section>

   <sidebar />
</template>

<script lang="ts" setup>
import { computed, ref, onBeforeUpdate, Ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import DishItem from '@/components/Dish.vue';
import PrintButton from '@/components/common/PrintButton.vue';
import SaveButton from '@/components/common/SaveButton.vue';
import ListButton from '@/components/common/ListButton.vue';
import IconButton from '@/components/common/IconButton.vue';
import Settings from '@/components/Settings.vue';
import MinusIcon from '@/assets/minus.svg';
import PlusIcon from '@/assets/plus.svg';
import { useSettingsStore } from '@/stores/settings';
import { useFoodStore } from '@/stores/food';
import { useUserStore } from '@/stores/user';
import { MovedDish } from '@/stores/food/types';

const settingsStore = useSettingsStore();
const foodStore = useFoodStore();
const userStore = useUserStore();
const divs: Ref<{ [key: string]: HTMLElement }> = ref({});

onBeforeUpdate(() => {
   divs.value = {};
});

const days = computed(() => settingsStore.days);
const timetable = computed(() => foodStore.timetable);
const currentMenu = computed(() => userStore.currentMenu);

const addDish = (id: string, dayKey: number, mealKey: number, sortNumber: number): void => {
   const addedDish = { ...foodStore.dishById(+id) };
   foodStore.addDish({ addedDish, dayKey, mealKey, sortNumber });
};

const moveDish = (dishJSON: string, moveFrom: MovedDish, moveTo: { dayKey: number; mealKey: number }, sortNumber: number ): void => {
   const movedDish = JSON.parse(dishJSON);
   foodStore.moveDish({ movedDish, moveFrom, moveTo, sortNumber });
};

const deleteDish = (computedId: string, dayKey: number, mealKey: number): void => {
   foodStore.deleteDish({ computedId, dayKey, mealKey });
   settingsStore.changeMenuType('dishes');
};

const allowDrop = (ev: DragEvent, dayKey: number, mealKey: number): void => {
   ev.preventDefault();
   if (ev.dataTransfer.types.includes('addingredient')) {
      return;
   }
   divs.value[`day_${dayKey}_${mealKey}`].classList.add('timeline-menu-dishes-hovered');
};

const removeBorder = (ev: DragEvent, dayKey: number, mealKey: number): void => {
   ev.preventDefault();
   if ((ev.currentTarget as HTMLElement).contains(ev.relatedTarget as Node) || ev.dataTransfer.types.includes('addingredient')) {
      return;
   }
   divs.value[`day_${dayKey}_${mealKey}`].classList.remove('timeline-menu-dishes-hovered');
};

const drop = (ev: DragEvent, dayKey: number, mealKey: number): void => {
   ev.preventDefault();
   const addedDish = ev.dataTransfer.getData('addDish');
   const movedDish = ev.dataTransfer.getData('moveDish');
   const sortNumber = +(ev.target as HTMLElement).dataset.index || foodStore.timetable[dayKey].meals[mealKey].menu.length;

   if (addedDish) {
      addDish(addedDish, dayKey, mealKey, sortNumber);
   } else if (movedDish) {
      const moveFrom = JSON.parse(ev.dataTransfer.getData('moveSettings'));
      if (moveFrom.dayKey !== dayKey || moveFrom.mealKey !== mealKey) {
         moveDish(movedDish, moveFrom, { dayKey, mealKey }, sortNumber);
      }
   }

   for (let component in divs.value) {
      // eslint-disable-next-line no-prototype-builtins
      if (divs.value.hasOwnProperty(component)) {
         if (divs.value[component].classList.contains('timeline-menu-dishes-hovered')) {
            divs.value[component].classList.remove('timeline-menu-dishes-hovered');
         }
      }
   }
};

const addDay = (): void => settingsStore.changeDays(settingsStore.days + 1);

const removeDay = (dayKey: number): void => settingsStore.removeDay(dayKey);

const drawSortZone = (ev: DragEvent): void => {
   ev.preventDefault();
   (ev.target as HTMLElement).classList.add('underHover');
};

const removeSortZone = (ev: DragEvent): void => (ev.target as HTMLElement).classList.remove('underHover');

const sortDish = (ev: DragEvent, sortNumber: number): void => {
   (ev.target as HTMLElement).classList.remove('underHover');
   const addedDish = ev.dataTransfer.getData('addDish');
   if (addedDish) {
      return;
   }

   const moveFrom = JSON.parse(ev.dataTransfer.getData('moveSettings'));
   const movedDish = JSON.parse(ev.dataTransfer.getData('moveDish'));
   const currentNumber = foodStore.timetable[moveFrom.dayKey].meals[moveFrom.mealKey].menu.map(item => item.id).indexOf(movedDish.id);

   if (Math.abs(currentNumber - sortNumber) !== 0 && sortNumber - currentNumber !== 1) {
      foodStore.sortDish({ movedDish, moveFrom, sortNumber });
   }
};
</script>

<style lang="less">
@import "../assets/constants.less";

.timeline {
   &-header {
      display: flex;

      h1 {
         margin: 0 12px 0 12px;
      }
   }

   &-day {
      border-bottom: 1px solid #ececec;
      align-items: end;
      margin-bottom: 12px;

      &-title {
         font-size: 18px;
         font-weight: bold;
         margin: 0 0 8px 14px;
         display: flex;
      }

      &-delete {
         margin-left: 10px;
         height: 28px;
         width: 28px;
         justify-content: space-evenly;
      }
   }

   &-menu {
      display: flex;
      flex-grow: 1;

      &-dishes {
         padding: 12px;
         min-height: 120px;
         height: 100%;
         margin: 4px;

         &-container {
            position: inherit;
         }

         @media (min-width: @largeResolution) {
            padding: 18px;
         }

         &-hovered {
            outline: #9d9d9d dashed 1px;
         }
      }

      &-dish {
         display: flex;
         flex-direction: column;
         flex-grow: 1;
         flex-basis: 0;
         overflow: hidden;
         margin-bottom: 12px;
         border-right: 1px solid #ececec;

         &:last-of-type {
            border-right: 0;
         }

         &-sortZone {
            height: 10px;

            &.underHover {
               height: 30px;
            }
         }
      }

      &-title {
         font-weight: bold;
         text-align: center;
      }
   }

   &-addDay {
      margin: 12px auto;

      @media (max-width: @mobileResolution)  {
         display: none;
      }
   }
}
</style>
