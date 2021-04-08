<template>
   <div class="food-menu">
      <h3 @click="changeMenuType()">{{menuType === 'dishes' ? 'Блюда' : 'Ингредиенты'}}</h3>
      <div v-for="(group, groupId) in groups" v-bind:key="groupId">
         <div
            class="food-menu-category"
            @click="toggleGroup(groupId)">
            <span class="food-menu-category-title">{{group.name}}</span>
            <span :class="`food-menu-category-spoiler ${!group.expanded ? 'food-menu-category-spoiler-closed' : ''}`">></span>
         </div>

         <div v-if="group.expanded">
            <div
               v-for="(item, key) in (menuType === 'dishes' ? dishesByGroup(groupId) : ingredientsByGroup(groupId))"
               :id="item.id"
               class="item"
               v-bind:key="key"
               draggable="true"
               @dragstart="dragStart"
            >
               {{item.title}}
            </div>
            <div
               v-if="!dishes.length"
               class="item item-skeleton"
            ></div>
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

      const menuType = computed(() => store.state.menuType);
      const dishes = computed(() => store.state.food.dishes);
      const ingredients = computed(() => store.state.food.ingredients);
      const ingredientsByGroup = computed(() => store.getters.ingredientsByGroup);
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

      const changeMenuType = () => store.dispatch('changeMenuType');
      const dragStart = (ev) => {
         const type = menuType.value === 'dishes' ? 'addDish' : 'addIngredient';
         return ev.dataTransfer.setData(type, ev.target.getAttribute('id'));
      };
      const toggleGroup = (groupId) => {
         groups.map((group) => {
            if (group.id === groupId) {
               group.expanded = !group.expanded;
            }
         });
      };

      return {
         dishes,
         ingredients,
         ingredientsByGroup,
         dishesByGroup,
         groups,
         menuType,
         dragStart,
         toggleGroup,
         changeMenuType,
      };
   }
};
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

   &:not(.item-skeleton):hover {
      box-shadow: @boxShadowHovered;
      padding: 6px 12px;
      //border-style: dashed;
      //border-color: #9d9d9d;
      //border-width: 1.7px;
      cursor: move;
   }

   &-skeleton {
      height: 22px;
      width: 150px;
      background: linear-gradient(270deg, #e2e2e2, #fff);
      background-size: 400% 400%;
      animation: SkeletonAnimation 1s ease infinite;
   }
}

@keyframes SkeletonAnimation {
   0%{background-position: 0 50%}
   25%{background-position: 25% 50%}
   50%{background-position: 50% 50%}
   75%{background-position: 25% 50%}
   100%{background-position: 0 50%}
}
</style>
