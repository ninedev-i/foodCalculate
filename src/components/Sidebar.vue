<template>
   <aside class="sidebar">
      <div class="sidebar-header">
         <popup
            v-if="menuType === 'dishes'"
            :text="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои блюда' : ''"
         >
            <icon-button
               :disabled="!isAuthenticated"
               caption="Добавить блюдо"
               size="26px"
               @click="toggleDishDialog(true, true)"
            >
               <plus-icon />
            </icon-button>
         </popup>
         <popup
            v-else-if="menuType === 'ingredients'"
            :text="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои ингредиенты' : ''"
         >
            <icon-button
               :disabled="!isAuthenticated"
               caption="Добавить ингредиент"
               size="26px"
               @click="isAddIngredientDialogOpened = true"
            >
               <plus-icon />
            </icon-button>
         </popup>
      </div>

      <div v-for="[groupName, group] in (menuType === 'dishes' ? dishGroups : ingredientGroups)" :key="groupName">
         <div
            class="sidebar-category"
            @click="toggleGroup(groupName)"
         >
            <expand-arrow-icon :class="`sidebar-category-spoiler ${!group.expanded ? 'sidebar-category-spoiler-closed' : ''}`" />
            <span class="sidebar-category-title">{{ groupName }}</span>
         </div>

         <div v-if="group.expanded">
            <div
               v-for="(item, key) in group.items"
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

   <Suspense>
      <delete-item-dialog v-if="deleteItemNumber" :item-id="deleteItemNumber" :menu-type="menuType" @close="deleteItemNumber = null" />
   </Suspense>
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
import { computed, defineAsyncComponent, reactive, ref } from 'vue';
import IconButton from '@/components/common/IconButton.vue';
import Popup from '@/components/common/Popup.vue';
import ExpandArrowIcon from '@/assets/expandArrow.svg';
import CrossIcon from '@/assets/cross.svg';
import PlusIcon from '@/assets/plus.svg';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
const DishDialog = defineAsyncComponent(() => import('@/components/dialogs/Dish.vue'));
const AddIngredientDialog = defineAsyncComponent(() => import('@/components/dialogs/AddIngredient.vue'));
const DeleteItemDialog = defineAsyncComponent(() => import('@/components/dialogs/DeleteItem.vue'));

const foodStore = useFoodStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const menuType = computed(() => settingsStore.menuType);
const isAuthenticated = computed(() => !!userStore.email);
const dishGroups = reactive(foodStore.dishMenusGrouped);
const ingredientGroups = reactive(foodStore.ingredientsGrouped);
const deleteItemNumber = ref<number>(null);
const dishDialogSettings = ref({ isOpened: false, isEdited: false, dish: null });
const isAddIngredientDialogOpened = ref(false);

const dragStart = (ev: DragEvent): void => {
   const type = menuType.value === 'dishes' ? 'addDish' : 'addIngredient';
   const target = ev.target as Element;
   return ev.dataTransfer.setData(type, target.getAttribute('id'));
};

const toggleGroup = (groupName: string): void => {
   const group = menuType.value === 'dishes' ? dishGroups : ingredientGroups;
   group.get(groupName).toggle();
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
      margin: 10px 6px;
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
