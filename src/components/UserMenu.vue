<template>
   <div class="userMenu-container">
      <h4>Сохраненные меню</h4>
      <table class="userMenu-table">
         <tr>
            <th>Название</th>
            <th>Обновлено</th>
         </tr>
         <tr v-for="(menu, i) in menus" :key="i">
            <td>
               <span v-if="!menu.is_current">{{ menu.title }}</span>

               <common-input
                  v-if="menu.is_current && inputs[menu.id]"
                  :class-name="`${menu.is_current ? 'userMenu-table-currentItem' : ''}`"
                  border-bottom
                  type="text"
                  input-width="200px"
                  :value="inputs[menu.id]"
                  @changeValue="(value) => handleInput(value, menu.id)"
               />
            </td>
            <td>{{ getFormattedDate(menu.updated_at) }}</td>
            <td width="200px">
               <div class="userMenu-table-actions">
                  <common-button
                     class="userMenu-table-action"
                     appearance="outlined"
                     width="80px"
                     margin="0 0 0 12px"
                     @click="deleteItem(menu.id)"
                  >
                     Удалить
                  </common-button>
                  <common-button
                     v-if="!menu.is_current"
                     class="userMenu-table-action"
                     appearance="outlined"
                     width="80px"
                     margin="0 0 0 12px"
                     @click="chooseItem(menu.id)"
                  >
                     Выбрать
                  </common-button>
                  <common-button
                     v-if="menu.is_current && (isDataChanged || isTitleChanged)"
                     width="85px"
                     margin="0 0 0 12px"
                     @click="updateItem(menu.id)"
                  >
                     Обновить
                  </common-button>
               </div>
            </td>
         </tr>
      </table>

      <common-button
         width="80px"
         @click="addMenu"
      >
         Добавить
      </common-button>
   </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue';
import CommonButton from '@/components/common/Button.vue';
import CommonInput from '@/components/common/Input.vue';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';
import { SavedMenu } from '@/stores/user/types';

defineComponent({
   name: 'UserMenu',
});

const userStore = useUserStore();
const foodStore = useFoodStore();
const settingsStore = useSettingsStore();
const menus = computed(() => userStore.menus);
const inputs = computed(() => userStore.menusForInput);
// TODO поле ввода по клику. по ховеру карандаш

const isTitleChanged = computed(() => {
   const current = userStore.menus.find((item: SavedMenu) => item.is_current);
   return current.title !== inputs.value[current.id];
});

const isDataChanged = computed(() => {
   const current = userStore.menus.find((item: SavedMenu) => item.is_current);
   if (current) {
      const isMenuChanged = foodStore.isTimetableChanged;
      const isDaysChanged = current.settings.days !== settingsStore.days;
      const isPeopleChanged = current.settings.people !== settingsStore.people;

      return isMenuChanged || isDaysChanged || isPeopleChanged;
   }
   return false;
});

const handleInput = (value: string, id: number) => {
   userStore.setMenusForInput({ value, id });
};

const addMenu = () => {
   const data = {
      title: 'Поход',
      settings: JSON.stringify({ people: settingsStore.people, days: settingsStore.days }),
      content: JSON.stringify(foodStore.timetable),
   };
   userStore.addMenu(data);
};

const updateItem = (id: number) => {
   const data = {
      id,
      title: inputs.value[id],
      settings: JSON.stringify({ people: settingsStore.people, days: settingsStore.days }),
      content: JSON.stringify(foodStore.timetable),
   };
   userStore.updateMenu(data);
};

const deleteItem = (id: number) => {
   userStore.deleteMenu(id);
};

const chooseItem = (id: number) => {
   userStore.chooseMenu(id);
};

const getFormattedDate = (date: string) => {
   const currentDate = new Date(date);
   return currentDate.toLocaleString('ru', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
   });
};
</script>

<style lang="less">
@import "../assets/constants.less";

.userMenu {
   &-container {
      background: @containerBackground;
      border: 1px solid @borderColorLight;
      box-shadow: @boxShadow;
      padding: 12px;
      margin-top: 12px;
   }

   &-table {
      width: 100%;
      font-size: 14px;
      margin: 12px 0 12px;
      border-spacing: 0 6px;

      &-actions {
         display: flex;
         justify-content: flex-end;
      }

      &-action {
         display: none;
      }

      &-currentItem {
         font-weight: bold;
      }

      & th {
         color: @borderColor;
         font-weight: normal;
         text-align: left;
      }

      & tr {
         height: 30px;
         &:hover .userMenu-table-action {
            display: block;
         }

         &:not(:last-child) td {
            border-bottom: 1px solid @accentColor;
         }
      }

      & td {
         height: 40px;
      }
   }
}
</style>
