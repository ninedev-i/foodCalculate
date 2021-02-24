<template>
   <div class="food-menu">
      <h3>Блюда</h3>
      <div v-for="(group, groupId) in groups" v-bind:key="groupId">
         <div
            class="food-menu-category"
            @click="toggleGroup(groupId)">
            <span class="food-menu-category-title">{{group.name}}</span>
            <span :class="`food-menu-category-spoiler ${!group.expanded ? 'food-menu-category-spoiler-closed' : ''}`">></span>
         </div>

         <div v-if="group.expanded">
            <div
               v-for="(item, key) in dishesByGroup(groupId)"
               :id="item.id"
               class="item"
               v-bind:key="key"
               draggable="true"
               @dragstart="dragStart"
               >
               {{item.name}}
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {computed, reactive} from 'vue';
import {useStore} from 'vuex';

export default {
   name: 'Menu',
   setup() {
      const store = useStore();

      const dishes = computed(() => store.state.dishes);
      const dishesByGroup = computed(() => store.getters.dishesByGroup);
      const groups = reactive([
          {
              id: 0,
              name: 'Напитки',
              expanded: true
          },
          {
              id: 1,
              name: 'Каши',
              expanded: true
          },
          {
              id: 2,
              name: 'Второе',
              expanded: true
          },
          {
              id: 3,
              name: 'Супы',
              expanded: true
          }
      ]);

      const dragStart = (ev) => ev.dataTransfer.setData('addDish', ev.target.getAttribute('id'));
      const toggleGroup = (groupId) => {
          groups.value.map((group) => {
              if (group.id === groupId) {
                  group.expanded = !group.expanded;
              }
          })
      };

      return {
         dishes,
         dishesByGroup,
         groups,
         dragStart,
         toggleGroup,
      }
   }
}
</script>

<style scoped lang="less">
   @import "../assets/constants.less";

   h3 {
      margin: 12px;
      text-align: center;
   }
   .food-menu {
      width: 220px;
      background: aquamarine;
      height: 100%;
      min-height: 100vh;
      padding: 0 6px;
      flex-shrink: 0;

      &-category {
         font-weight: bold;
         margin: 16px 0 0 6px;
         display: flex;
         cursor: pointer;

         &-title {
            margin-right: 10px;
         }

         &-spoiler {
            transform: rotate(90deg);
            display: flex;
            justify-content: center;

            &-closed {
               transform: rotate(270deg);
            }
         }
      }
   }


   .item {
      background: white;
      margin: 6px;
      padding: 6px 12px;
      box-shadow: @boxShadow;
      font-weight: bold;
      width: fit-content;

      &:hover {
         box-shadow: @boxShadowHovered;
         padding: 6px 12px;
         //border-style: dashed;
         //border-color: #9d9d9d;
         //border-width: 1.7px;
         cursor: move;
       }
   }
</style>
