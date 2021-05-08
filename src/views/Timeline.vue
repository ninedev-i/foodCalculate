<template>
   <section class="timeline-container">
      <h1>Меню</h1>
      <div
         class="timeline-day"
         v-for="(dayKey) in days"
         v-bind:key="dayKey"
      >

         <div class="timeline-day-title">День {{dayKey}}</div>

         <div class="timeline-menu">
            <div
               class="timeline-menu-dish"
               v-for="(dish, dishKey) in timetable[dayKey - 1].dishes"
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
                  <div v-for="(dish, menuKey) in dish.menu" :key="menuKey">
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
      <PlusButton
         class="timeline-addDay"
         caption="Добавить день"
         @click="addDay"
      />
   </section>
</template>

<script>
import {computed, ref, onBeforeUpdate} from 'vue';
import {useStore} from 'vuex';
import dish from '@/components/Dish.vue';
import PlusButton from '@/components/common/PlusButton.vue';

export default {
   name: 'Timeline',
   components: {
      dish,
      PlusButton,
   },
   setup() {
      const store = useStore();
      const divs = ref([]);

      onBeforeUpdate(() => {
         divs.value = [];
      });

      const days = computed(() => store.state.days);
      const timetable = computed(() => store.state.food.timetable);

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

      return {
         divs,
         days,
         timetable,
         drop,
         addDay,
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
   &-container {
      h1 {
         margin-left: 12px;
      }
   }

   &-day {
      border-bottom: 1px solid #ececec;

      &-title {
         font-size: 18px;
         font-weight: bold;
         margin: 0 0 8px 14px;
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
