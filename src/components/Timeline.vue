<template>
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
            >
            <div class="timeline-menu-title">{{dish.name}}</div>
            <div
               class="timeline-menu-dishes"
               @drop="drop($event, dayKey - 1, dishKey)"
               @dragover="allowDrop($event, dayKey - 1, dishKey)"
               @dragleave="removeBorder($event, dayKey - 1, dishKey)"
               :ref="`day_${dayKey - 1}_${dishKey}`"
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
</template>

<script>
import {computed} from 'vue';
import {useStore} from 'vuex';
import dish from '@/components/Dish';

export default {
   name: 'Timeline',
   components: {
      dish,
   },
   setup() {
      const store = useStore();

      return {
         days: computed(() => store.state.days),
         timetable: computed(() => store.state.timetable),
         addDish: (id, dayKey, dishKey) => {
            const addedDish = {...store.getters.dishById(+id)};
            store.dispatch('addDish', {addedDish, dayKey, dishKey});
         },
         moveDish: (dishJSON, moveFrom, moveTo) => {
            const movedDish = JSON.parse(dishJSON);
            store.dispatch('moveDish', {movedDish, moveFrom, moveTo});
         },
         deleteDish: (id, dayKey, dishKey) => {
            store.dispatch('deleteDish', {id, dayKey, dishKey});
         },
      }
   },
   methods: {
      allowDrop(ev, dayKey, dishKey) {
         ev.preventDefault();
         this.$refs[`day_${dayKey}_${dishKey}`].classList.add('timeline-menu-dishes-hovered');
      },

      removeBorder(ev, dayKey, dishKey) {
         ev.preventDefault();
         this.$refs[`day_${dayKey}_${dishKey}`].classList.remove('timeline-menu-dishes-hovered');
      },

      drop(ev, dayKey, dishKey) {
         ev.preventDefault();
         const addDish = ev.dataTransfer.getData('addDish');
         const moveDish = ev.dataTransfer.getData('moveDish');
         if (addDish) {
            this.addDish(addDish, dayKey, dishKey)
         } else if (moveDish) {
            const moveFrom = JSON.parse(ev.dataTransfer.getData('moveSettings'));
            this.moveDish(moveDish, moveFrom,{dayKey, dishKey})
         }
         this.$refs[`day_${dayKey}_${dishKey}`].classList.remove('timeline-menu-dishes-hovered');
      },
   }
}
</script>

<style lang="less">
   .timeline {
      &-day {
         margin: 12px;
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
   }
</style>