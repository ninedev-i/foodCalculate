<template>
   <div class="sidebar">
<!--      <h3>-->
<!--         <span-->
<!--            :class="`${menuType !== 'dishes' ? 'sidebar-title-link' : 'sidebar-title-current'}`"-->
<!--            @click="changeMenuType('dishes')">Блюда</span>-->
<!--         <span class="sidebar-title-separator">/</span>-->
<!--         <span-->
<!--            :class="`${menuType === 'dishes' ? 'sidebar-title-link' : 'sidebar-title-current'}`"-->
<!--            @click="changeMenuType('ingredients')">Ингредиенты</span>-->
<!--      </h3>-->
      <div v-for="(group, groupId) in (menuType === 'dishes' ? dishGroups : ingredientGroups)" v-bind:key="groupId">
         <div
            class="sidebar-category"
            @click="toggleGroup(groupId)">
            <expand-arrow-icon :class="`sidebar-category-spoiler ${!group.expanded ? 'sidebar-category-spoiler-closed' : ''}`"/>
            <span class="sidebar-category-title">{{group.name}}</span>
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
   name: 'Sidebar',
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
.sidebar {
   padding: 0 6px;
   height: 100vh;

   @media print {
      display: none;
   }

   &-title {
      &-separator {
         margin: 0 6px;
      }

      &-link {
         font-weight: normal;
         &:hover {
            cursor: pointer;
            font-weight: bold;
         }
      }
   }

   &-category {
      font-weight: bold;
      margin: 13px 0 0 6px;
      display: flex;
      cursor: pointer;
      align-items: center;

      &-title {
         margin-right: 10px;
      }

      &-spoiler {
         width: 10px;
         height: 18px;
         margin-right: 6px;
         transition: 0.5s;
         fill: @fontColor;

         &-closed {
            transform: rotate(-90deg);
         }
      }
   }
}

.item {
   background: white;
   margin: 6px 12px;
   padding: 4px 10px;
   box-shadow: @boxShadow;
   font-weight: bold;
   width: fit-content;
   font-size: 15px;

   &::first-letter {
      text-transform: uppercase;
   }

   &:not(.item-custom-disabled):hover {
      box-shadow: @boxShadowHovered;
      padding: 4px 10px;
      cursor: move;
   }

   &-custom {
      margin: 24px 12px 12px;

      &-disabled {
         color: gray;
      }
   }
}
</style>
