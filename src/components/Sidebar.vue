<template>
   <aside class="sidebar">
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
   </aside>
</template>

<script lang="ts" setup>
import { computed, defineComponent, reactive } from 'vue';
import AddIngredient from '@/components/AddIngredient.vue';
import ExpandArrowIcon from '@/assets/expandArrow.svg';
import { Group } from '@/stores/food/types';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';

defineComponent({
   name: 'Sidebar',
});

const foodStore = useFoodStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const menuType = computed(() => settingsStore.menuType);
const isAuthenticated = computed(() => !!userStore.email);
const ingredientsByGroup = computed(() => foodStore.ingredientsByGroup);
const dishesByGroup = computed(() => foodStore.dishesByGroup);
const dishGroups = reactive(foodStore.dishGroups.map((item: Group) => ({ ...item, ...{ expanded: true } })));
const ingredientGroups = reactive(foodStore.ingredientGroups.map((item: Group) => ({ ...item, ...{ expanded: true } })));

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
   display: flex;
   flex-direction: column;
   position: fixed;
   right: 0;
   width: 250px;
   overflow-y: scroll;
   background: @accentColor;
   padding: 0 6px;
   height: 100vh;
   top: 0;
   z-index: 12;

   &:hover {
      &::-webkit-scrollbar-thumb {
         background-color: #40d9a6;
      }
   }

   &::-webkit-scrollbar-thumb {
      background-color: @accentColor;
   }

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
