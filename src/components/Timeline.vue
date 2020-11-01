<template>
   <div
      class="timeline-day"
      v-for="(day, dayKey) in timetable"
      v-bind:key="dayKey"
      >
      <div class="timeline-day-title">День {{dayKey + 1}}</div>

      <div class="timeline-menu">
         <div
            class="timeline-menu-dish"
            v-for="(dish, dishKey) in day.dishes"
            v-bind:key="dishKey"
            >
            <div class="timeline-menu-title">{{dish.name}}</div>
            <div
               class="timeline-menu-dishes"
               @drop="drop($event, dayKey, dishKey)"
               @dragover="allowDrop($event, dayKey, dishKey)"
               @dragleave="removeBorder($event, dayKey, dishKey)"
               :ref="`day_${dayKey}_${dishKey}`"
               >
               <div v-for="(dish, menuKey) in dish.menu" :key="menuKey">
                  <dish
                     :dish="dish"
                     :dayKey="dayKey"
                     :dishKey="dishKey"
                     @delete-item="deleteDish(dish.id, dayKey, dishKey)"
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
         timetable: computed(() => store.state.timetable),
         addDish: (id, dayKey, dishKey) => {
            const addedDish = store.getters.dishById(+id);
            store.dispatch('addDish', {addedDish, dayKey, dishKey});
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
            const moveSettings = JSON.parse(ev.dataTransfer.getData('moveSettings'));
            this.moveDish(moveDish, moveSettings, dayKey, dishKey)
         }
         this.$refs[`day_${dayKey}_${dishKey}`].classList.remove('timeline-menu-dishes-hovered');
      },

      moveDish(data, deletedItem, dayKey, dishKey) {
         const movedDish = JSON.parse(data);
         this.timetable[dayKey].dishes[dishKey].menu.push(movedDish);
         this.deleteDish(movedDish.id, deletedItem.dayKey, deletedItem.dishKey);
      },

      // FIX: сейчас удаляет все итемы с одинаковым id (они должны быть уникальны)
      deleteDish(id, dayKey, dishKey) {
         const editedMenu = this.timetable[dayKey].dishes[dishKey].menu.filter((item) => id !== item.id);
         this.timetable[dayKey].dishes[dishKey].menu = editedMenu;
      }
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