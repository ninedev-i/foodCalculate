<template>
   <section class="timeline-container">
      <div class="timeline-header">
         <h1>Меню {{ menuName ? `«${menuName}»` : '' }}</h1>
         <print-button />
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
               v-for="(dish, dishKey) in timetable[dayKey - 1]?.dishes"
               :key="dishKey"
               class="timeline-menu-dish"
               @dragover="allowDrop($event, dayKey - 1, dishKey)"
               @dragleave="removeBorder($event, dayKey - 1, dishKey)"
            >
               <div class="timeline-menu-title">{{ dish.name }}</div>
               <div
                  :ref="(el) => {divs[`day_${dayKey - 1}_${dishKey}`] = el}"
                  class="timeline-menu-dishes"
                  @drop="drop($event, dayKey - 1, dishKey)"
               >
                  <div v-for="(dish, menuKey) in dish.menu" :key="menuKey" class="timeline-menu-dishes-container">
                     <div
                        v-if="menuKey === 0"
                        class="timeline-menu-dish-sortZone"
                        :data-index="menuKey"
                        @dragover="drawSortZone($event, dish)"
                        @dragleave="removeSortZone($event)"
                        @drop="sortDish($event, menuKey)"
                     ></div>
                     <dish-item
                        :dish="dish"
                        :day-key="dayKey - 1"
                        :dish-key="dishKey"
                        @delete-item="deleteDish(dish.id, dayKey - 1, dishKey)"
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
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref, onBeforeUpdate, Ref } from 'vue';
import DishItem from '@/components/Dish.vue';
import PrintButton from '@/components/common/PrintButton.vue';
import IconButton from '@/components/common/IconButton.vue';
import MinusIcon from '@/assets/minus.svg';
import PlusIcon from '@/assets/plus.svg';
import { scrollToElementIfIsNotVisible } from '@/utils';
import { useSettingsStore } from '@/stores/settings';
import { useFoodStore } from '@/stores/food';
import { useUserStore } from '@/stores/user';
import { MovedDish } from '@/stores/food/types';

defineComponent({
   name: 'Timeline',
});

// TODO добавить возможность изменять название дня (например День 1 => Заброска)

const settingsStore = useSettingsStore();
const foodStore = useFoodStore();
const userStore = useUserStore();
const divs: Ref<{ [key: string]: HTMLElement }> = ref({});

onBeforeUpdate(() => {
   divs.value = {};
});

const days = computed(() => settingsStore.days);
const timetable = computed(() => foodStore.timetable);
const menuName = computed(() => userStore.currentMenuTitle);
const isShowBackground = computed(() => settingsStore.isShowBackground);

const addDish = (id: string, dayKey: number, dishKey: number, sortNumber: number): void => {
   const addedDish = { ...foodStore.dishById(+id) };
   foodStore.addDish({ addedDish, dayKey, dishKey, sortNumber });
};

const moveDish = (dishJSON: string, moveFrom: MovedDish, moveTo: { dayKey: number; dishKey: number }, sortNumber: number ): void => {
   const movedDish = JSON.parse(dishJSON);
   foodStore.moveDish({ movedDish, moveFrom, moveTo, sortNumber });
};

const deleteDish = (id: string, dayKey: number, dishKey: number): void => {
   foodStore.deleteDish({ id, dayKey, dishKey });
   settingsStore.changeMenuType('dishes');
   if (isShowBackground.value) {
      settingsStore.toggleIsShowBackground();
   }
};

const allowDrop = (ev: DragEvent, dayKey: number, dishKey: number): void => {
   ev.preventDefault();
   divs.value[`day_${dayKey}_${dishKey}`].classList.add('timeline-menu-dishes-hovered');
};

const removeBorder = (ev: DragEvent, dayKey: number, dishKey: number): void => {
   ev.preventDefault();
   if ((ev.currentTarget as HTMLElement).contains(ev.relatedTarget as Node)) {
      return;
   }
   divs.value[`day_${dayKey}_${dishKey}`].classList.remove('timeline-menu-dishes-hovered');
};

const drop = (ev: DragEvent, dayKey: number, dishKey: number): void => {
   ev.preventDefault();
   const addedDish = ev.dataTransfer.getData('addDish');
   const movedDish = ev.dataTransfer.getData('moveDish');
   const sortNumber = +(ev.target as HTMLElement).dataset.index || foodStore.timetable[dayKey].dishes[dishKey].menu.length;

   if (addedDish) {
      if (addedDish === 'null') {
         // Свое блюдо
         setTimeout(() => {
            scrollToElementIfIsNotVisible(
               document.querySelector('.dish-edited'),
               document.querySelector('.layout-page')
            );
            settingsStore.toggleIsShowBackground();
         }, 100);
      }
      addDish(addedDish, dayKey, dishKey, sortNumber);
   } else if (movedDish) {
      const moveFrom = JSON.parse(ev.dataTransfer.getData('moveSettings'));
      if (moveFrom.dayKey !== dayKey || moveFrom.dishKey !== dishKey) {
         moveDish(movedDish, moveFrom, { dayKey, dishKey }, sortNumber);
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
   const currentNumber = foodStore.timetable[moveFrom.dayKey].dishes[moveFrom.dishKey].menu.map(item => item.id).indexOf(movedDish.id);

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
         // FIXME попробовать иконку крестик
      }
   }

   &-menu {
      display: flex;
      flex-grow: 1;

      &-dishes {
         padding: 12px;
         min-height: 120px;
         height: 100%;
         position: relative;
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
   }
}
</style>
