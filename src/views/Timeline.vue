<template>
   <section class="timeline-container">
      <div class="timeline-header">
         <h1>Меню {{menuName ? `«${menuName}»` : ''}}</h1>
         <print-button />
      </div>

      <div
         class="timeline-day"
         v-for="(dayKey) in days"
         v-bind:key="dayKey"
      >

         <div class="timeline-day-title">
            <span>День {{dayKey}}</span>
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
               class="timeline-menu-dish"
               v-for="(dish, dishKey) in timetable[dayKey - 1]?.dishes"
               v-bind:key="dishKey"
               @dragover="allowDrop($event, dayKey - 1, dishKey)"
               @dragleave="removeBorder($event, dayKey - 1, dishKey)"
            >
               <div class="timeline-menu-title">{{dish.name}}</div>
               <div
                  class="timeline-menu-dishes"
                  @drop="drop($event, dayKey - 1, dishKey)"
                  :ref="(el) => {divs[`day_${dayKey - 1}_${dishKey}`] = el}"
               >
                  <div class="timeline-menu-dishes-container" v-for="(dish, menuKey) in dish.menu" :key="menuKey">
                     <dish
                        :dish="dish"
                        :dayKey="dayKey - 1"
                        :dishKey="dishKey"
                        @delete-item="deleteDish(dish.id, dayKey - 1, dishKey)"
                     />
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

<script>
import {computed, ref, onBeforeUpdate} from 'vue';
import {useStore} from 'vuex';
import dish from '@/components/Dish.vue';
import PrintButton from '@/components/common/PrintButton.vue';
import IconButton from '@/components/common/IconButton.vue';
import MinusIcon from '@/assets/minus.svg?component';
import PlusIcon from '@/assets/plus.svg?component';
import {scrollToElementIfIsNotVisible} from '@/utils';

// TODO добавить возможность изменять название дня (например День 1 => Заброска)

export default {
   name: 'Timeline',
   components: {
      dish,
      IconButton,
      MinusIcon,
      PlusIcon,
      PrintButton,
   },
   setup() {
      const store = useStore();
      const divs = ref([]);

      onBeforeUpdate(() => {
         divs.value = [];
      });

      const days = computed(() => store.state.days);
      const timetable = computed(() => store.state.food.timetable);
      const menuName = computed(() => store.getters.currentMenuTitle);
      const isShowBackground = computed(() => store.state.isShowBackground);

      const addDish = (id, dayKey, dishKey) => {
         const addedDish = {...store.getters.dishById(+id)};
         store.dispatch('addDish', {addedDish, dayKey, dishKey});
      };
      const moveDish = (dishJSON, moveFrom, moveTo) => {
         const movedDish = JSON.parse(dishJSON);
         store.dispatch('moveDish', {movedDish, moveFrom, moveTo});
      };
      const sortDish = (dishJSON, moveFrom, sortNumber) => {
         const movedDish = JSON.parse(dishJSON);
         store.dispatch('sortDish', {movedDish, moveFrom, sortNumber});
      };
      const deleteDish = (id, dayKey, dishKey) => {
         store.dispatch('deleteDish', {id, dayKey, dishKey});
         store.dispatch('changeMenuType', 'dishes');
         if (isShowBackground.value) {
            store.dispatch('toggleIsShowBackground');
         }
      };
      const allowDrop = (ev, dayKey, dishKey) => {
         ev.preventDefault();
         if (ev.dataTransfer.types[0] !== 'adddish') {
            return;
         }
         divs.value[`day_${dayKey}_${dishKey}`].classList.add('timeline-menu-dishes-hovered');
      };
      const removeBorder = (ev, dayKey, dishKey) => {
         ev.preventDefault();
         if (!ev.target.classList.contains('timeline-menu-dishes-hovered')
            && !ev.target.classList.contains('timeline-menu-dish')
            && !ev.target.classList.contains('dish-container')
            && !ev.target.classList.contains('dish-ingredients-container')
            && !ev.target.parentNode.classList.contains('dish-container')
            && !ev.target.parentNode.classList.contains('dish-ingredients-container')) {
            divs.value[`day_${dayKey}_${dishKey}`].classList.remove('timeline-menu-dishes-hovered');
         }
      };
      const drop = (ev, dayKey, dishKey) => {
         ev.preventDefault();
         const addedDish = ev.dataTransfer.getData('addDish');
         const movedDish = ev.dataTransfer.getData('moveDish');
         if (addedDish) {
            if (addedDish === 'null') {
               // Свое блюдо
               setTimeout(() => {
                  scrollToElementIfIsNotVisible(
                     document.querySelector('.dish-edited'),
                     document.querySelector('.layout-page')
                  );
                  store.dispatch('toggleIsShowBackground');
               }, 100);
            }
            addDish(addedDish, dayKey, dishKey);
         } else if (movedDish) {
            const moveFrom = JSON.parse(ev.dataTransfer.getData('moveSettings'));

            if (moveFrom.dayKey === dayKey && moveFrom.dishKey === dishKey) {
               const sortNumber = ev.target.getAttribute('data-dish-number')
                  ? +ev.target.getAttribute('data-dish-number').split('_')[2]
                  : null;
               if (sortNumber) {
                  sortDish(movedDish, moveFrom, sortNumber);
               }
            } else {
               moveDish(movedDish, moveFrom,{dayKey, dishKey});
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
      const addDay = () => store.dispatch('changeDays', store.state.days + 1);
      const removeDay = (dayKey) => store.dispatch('removeDay', dayKey);

      return {
         divs,
         days,
         timetable,
         drop,
         addDay,
         removeDay,
         menuName,
         allowDrop,
         removeBorder,
         addDish,
         moveDish,
         sortDish,
         deleteDish,
      };
   },
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
         margin-bottom: 12px;
         min-height: 120px;
         height: 100%;
         position: relative;

         &-container {
            position: inherit;
         }

         @media (min-width: @largeResolution) {
            padding: 18px;
         }

         &-hovered {
            border-style: dashed;
            border-color: #9d9d9d;
            border-width: 1.7px;
            margin: 4.3px;
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
