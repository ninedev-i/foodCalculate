<template>
   <div class="sidebar">
      <div v-for="(group, groupId) in (menuType === 'dishes' ? dishGroups : ingredientGroups)" :key="groupId">
         <div
            class="sidebar-category"
            @click="toggleGroup(groupId)"
         >
            <expand-arrow-icon :class="`sidebar-category-spoiler ${!group.expanded ? 'sidebar-category-spoiler-closed' : ''}`" />
            <span class="sidebar-category-title">{{ group.name }}</span>
         </div>

         <div v-if="group.expanded">
            <div
               v-for="(item, key) in (menuType === 'dishes' ? dishesByGroup(groupId) : ingredientsByGroup(groupId))"
               :id="item.id"
               :key="key"
               class="item"
               draggable="true"
               @dragstart="dragStart"
            >
               {{ cutDishName(item.title) }}
            </div>
            <add-ingredient v-if="menuType === 'ingredients'" :type="groupId" />
         </div>
      </div>

      <div
         v-if="menuType === 'dishes'"
         :class="`item item-custom ${isAuthenticated ? '' :'item-custom-disabled'}`"
         :draggable="isAuthenticated"
         :title="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои блюда' : ''"
         @dragstart="dragStart"
      >
         Свое блюдо
      </div>
   </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import AddIngredient from '@/components/AddIngredient.vue';
import ExpandArrowIcon from '@/assets/expandArrow.svg';
import { Group } from '@/store/modules/food/types';

defineComponent({
   name: 'Sidebar',
});

const store = useStore();
const menuType = computed(() => store.state.menuType);
const isAuthenticated = computed(() => !!store.state.user.email);
const ingredientsByGroup = computed(() => store.getters.ingredientsByGroup);
const dishesByGroup = computed(() => store.getters.dishesByGroup);
const dishGroups = reactive(store.state.food.dishGroups.map((item: Group) => ({ ...item, ...{ expanded: true } })));
const ingredientGroups = reactive(store.state.food.ingredientGroups.map((item: Group) => ({ ...item, ...{ expanded: true } })));

const dragStart = (ev: DragEvent): void => {
   const type = menuType.value === 'dishes' ? 'addDish' : 'addIngredient';
   const target = ev.target as Element;
   return ev.dataTransfer.setData(type, target.getAttribute('id'));
};

const toggleGroup = (groupId: number): void => {
   (menuType.value === 'dishes' ? dishGroups : ingredientGroups).map((group: Group) => {
      if (group.id === groupId) {
         group.expanded = !group.expanded;
      }
   });
};

const cutDishName = (caption: string): string => caption.replace(/(каша|суп)/i, '').trim();
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
