<template>
   <aside class="sidebar">
      <div class="sidebar-header">
         <icon-button
            v-if="menuType === 'dishes'"
            :title="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои блюда' : ''"
            :disabled="!isAuthenticated"
            caption="Добавить блюдо"
            size="26px"
            @click="toggleDishDialog(true, true)"
         >
            <plus-icon />
         </icon-button>
         <icon-button
            v-else-if="menuType === 'ingredients'"
            :title="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои ингредиенты' : ''"
            :disabled="!isAuthenticated"
            caption="Добавить ингредиент"
            size="26px"
            @click="isAddIngredientDialogOpened = true"
         >
            <plus-icon />
         </icon-button>
      </div>

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
               :key="key"
               class="item-wrapper"
            >
               <div
                  :id="item.id"
                  class="item"
                  draggable="true"
                  @dragstart="dragStart"
                  @click="toggleDishDialog(true, false, item.id)"
               >
                  {{ cutDishName(item.title) }}
               </div>
               <div
                  v-if="!item.is_default"
                  class="item-delete"
                  title="Удалить"
                  @click="deleteItemNumber = item.id"
               >
                  <cross-icon />
               </div>
            </div>
         </div>
      </div>
   </aside>

   <delete-item-dialog v-if="deleteItemNumber" :item-id="deleteItemNumber" :menu-type="menuType" @close="deleteItemNumber = null" />
   <dish-dialog
      v-if="dishDialogSettings.isOpened"
      :dish="dishDialogSettings.dish"
      :is-edited="dishDialogSettings.isEdited"
      @close="toggleDishDialog(false)"
   />
   <add-ingredient-dialog
      v-if="isAddIngredientDialogOpened"
      @close="isAddIngredientDialogOpened = false"
   />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, defineComponent, reactive, ref } from 'vue';
import IconButton from '@/components/common/IconButton.vue';
import ExpandArrowIcon from '@/assets/expandArrow.svg';
import CrossIcon from '@/assets/cross.svg';
import PlusIcon from '@/assets/plus.svg';
import { Group } from '@/stores/food/types';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
const DishDialog = defineAsyncComponent(() => import('@/components/dialogs/Dish.vue'));
const AddIngredientDialog = defineAsyncComponent(() => import('@/components/dialogs/AddIngredient.vue'));
const DeleteItemDialog = defineAsyncComponent(() => import('@/components/dialogs/DeleteItem.vue'));

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
const deleteItemNumber = ref(null);
const dishDialogSettings = ref({ isOpened: false, isEdited: false, dish: null });
const isAddIngredientDialogOpened = ref(false);

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

const toggleDishDialog = (isOpened: boolean, isEdited: boolean = false, dishId: number | null = null) => {
   if (menuType.value === 'dishes') {
      dishDialogSettings.value = { isOpened, isEdited, dish: foodStore.dishById(dishId) };
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

   @media (max-width: @mobileResolution)  {
      display: none;
   }

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

   &-header {
      display: flex;
      margin: 12px 6px;
      align-self: start;
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

   &-wrapper {
      display: flex;
      align-items: baseline;
   }

   &-delete {
      cursor: pointer;
      width: 8px;
   }

   &::first-letter {
      text-transform: uppercase;
   }

   &:hover {
      box-shadow: @boxShadowHovered;
      padding: 4px 10px;
      cursor: move;
   }
}
</style>
