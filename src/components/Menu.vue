<template>
   <div class="food-menu">
      <h3>
         <span
            :class="`${menuType !== 'dishes' ? 'food-menu-title-link' : 'food-menu-title-current'}`"
            @click="changeMenuType('dishes')">Блюда</span>
         <span class="food-menu-title-separator">/</span>
         <span
            :class="`${menuType === 'dishes' ? 'food-menu-title-link' : 'food-menu-title-current'}`"
            @click="changeMenuType('ingredients')">Ингредиенты</span>
      </h3>
      <div v-for="(group, groupId) in (menuType === 'dishes' ? dishGroups : ingredientGroups)" v-bind:key="groupId">
         <div
            class="food-menu-category"
            @click="toggleGroup(groupId)">
            <expand-arrow-icon :class="`food-menu-category-spoiler ${!group.expanded ? 'food-menu-category-spoiler-closed' : ''}`"/>
            <span class="food-menu-category-title">{{group.name}}</span>
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
               {{cutDishName(item.title)}}
            </div>
            <add-ingredient :type="groupId" v-if="menuType === 'ingredients'" />

            <div
               v-if="!dishes.length"
               class="item item-skeleton"
            ></div>
         </div>
      </div>

      <div
         v-if="menuType === 'dishes'"
         :class="`item item-custom ${isAuthenticated ? '' :'item-custom-disabled'}`"
         :draggable="isAuthenticated"
         @dragstart="dragStart"
         :title="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои блюда' : ''"
      >
         Свое блюдо
      </div>
   </div>
</template>

<script>
import {computed, reactive} from 'vue';
import {useStore} from 'vuex';
import AddIngredient from '@/components/AddIngredient.vue';
import ExpandArrowIcon from '@/assets/expandArrow.svg?component';

export default {
   name: 'Menu',
   components: {
      AddIngredient,
      ExpandArrowIcon,
   },
   setup() {
      const store = useStore();
      const menuType = computed(() => store.state.menuType);
      const isAuthenticated = computed(() => !!store.state.user.email);
      const dishes = computed(() => store.state.food.dishes);
      const ingredients = computed(() => store.state.food.ingredients);
      const ingredientsByGroup = computed(() => store.getters.ingredientsByGroup);
      const dishesByGroup = computed(() => store.getters.dishesByGroup);
      const dishGroups = reactive(store.state.food.dishGroups.map(item => ({...item, ...{expanded: true}})));
      const ingredientGroups = reactive(store.state.food.ingredientGroups.map(item => ({...item, ...{expanded: true}})));
      const changeMenuType = (type) => store.dispatch('changeMenuType', type);
      const dragStart = (ev) => {
         const type = menuType.value === 'dishes' ? 'addDish' : 'addIngredient';
         return ev.dataTransfer.setData(type, ev.target.getAttribute('id'));
      };
      const toggleGroup = (groupId) => {
         (menuType.value === 'dishes' ? dishGroups : ingredientGroups).map((group) => {
            if (group.id === groupId) {
               group.expanded = !group.expanded;
            }
         });
      };
      const cutDishName = (caption) => caption.replace(/(каша|суп)/i, '').trim();

      return {
         dishes,
         ingredients,
         ingredientsByGroup,
         dishesByGroup,
         dishGroups,
         ingredientGroups,
         menuType,
         isAuthenticated,
         cutDishName,
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
   padding: 0 6px;
   height: 100vh;

   @media print {
      display: none;
   }

   &-title {
      &-separator {
         margin: 0 6px;
      }

      &-current {
         border-bottom: 2px solid @iconAccentedColor;

      }
      &-link:hover {
         cursor: pointer;
         color: @iconAccentedColor;
      }
   }

   &-category {
      font-weight: bold;
      margin: 16px 0 0 6px;
      display: flex;
      cursor: pointer;
      align-items: center;

      &-title {
         margin-right: 10px;
      }

      &-spoiler {
         width: 14px;
         height: 18px;
         margin-right: 6px;
         transition: 0.5s;
         fill: @iconAccentedColor;

         &-closed {
            transform: rotate(-90deg);
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

   &::first-letter {
      text-transform: uppercase;
   }

   &:not(.item-skeleton):hover:not(.item-custom-disabled):hover {
      box-shadow: @boxShadowHovered;
      padding: 6px 12px;
      cursor: move;
   }

   &-custom {
      margin: 24px 6px 12px;

      &-disabled {
         color: gray;
      }
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
