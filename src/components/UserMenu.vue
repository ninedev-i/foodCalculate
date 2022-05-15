<template>
   <div class="userMenu-container">
      <h4 class="userMenu-heading">Сохраненные меню</h4>
      <table class="userMenu-table">
         <tr>
            <th>Название</th>
            <th>Обновлено</th>
         </tr>
         <tr v-for="menu in menus" :key="menu.id" :class="`${menu.is_current ? 'userMenu-table-current' : ''}`">
            <td>
               <editable-input
                  :value="menu.title"
                  @save="(value) => updateMenuTitle(value, menu.id)"
               />
            </td>
            <td>{{ getFormattedDate(menu.updated_at) }}</td>
            <td class="userMenu-table-actionsRow">
               <div class="userMenu-table-actions">
                  <common-button
                     class="userMenu-table-action userMenu-table-action-delete"
                     appearance="outlined"
                     width="80px"
                     margin="0 0 0 12px"
                     @click="deleteMenuNumber = menu.id"
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
                     v-if="menu.is_current && isDataChanged"
                     class="userMenu-table-action-update"
                     width="85px"
                     margin="0 0 0 12px"
                     @click="updateMenu(menu.id)"
                  >
                     Обновить
                  </common-button>
               </div>
            </td>
         </tr>
      </table>

      <common-button
         width="80px"
         margin="12px"
         @click="addMenu"
      >
         Добавить
      </common-button>
   </div>

   <common-dialog
      :is-opened="deleteMenuNumber !== null"
      heading="Удаление меню"
      @close="deleteMenuNumber = null"
      @accept="userStore.deleteMenu(deleteMenuNumber)"
   >
      Вы действительно хотите удалить это меню?
   </common-dialog>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import CommonButton from '@/components/common/Button.vue';
import CommonDialog from '@/components/common/Dialog.vue';
import EditableInput from '@/components/common/EditableInput.vue';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';

defineComponent({
   name: 'UserMenu',
});

const userStore = useUserStore();
const foodStore = useFoodStore();
const settingsStore = useSettingsStore();
const isDataChanged = computed(() => settingsStore.isDataChanged);
const menus = computed(() => userStore.menus);
const deleteMenuNumber = ref(null);

const addMenu = (): Promise<void> => {
   const data = {
      title: 'Поход',
      settings: JSON.stringify({ people: settingsStore.people, days: settingsStore.days }),
      content: JSON.stringify(foodStore.timetable),
   };
   return userStore.addMenu(data);
};

const updateMenuTitle = (value: string, id: number): Promise<void> => userStore.updateMenu({ id, title: value });

const updateMenu = (id: number): Promise<void> => {
   const data = {
      id,
      settings: JSON.stringify({ people: settingsStore.people, days: settingsStore.days }),
      content: JSON.stringify(foodStore.timetable),
   };
   return userStore.updateMenu(data);
};

const chooseItem = (id: number): Promise<void> => userStore.chooseMenu(id);

const getFormattedDate = (date: string): string => {
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
      margin-top: 12px;
   }

   &-heading {
      margin: 12px;
   }

   &-table {
      width: 100%;
      font-size: 14px;
      margin: 12px 0 12px;
      border-spacing: 0;

      &-actionsRow {
         width: 200px;
      }

      &-actions {
         display: flex;
         justify-content: flex-end;
      }

      &-action {
         display: none;

         @media (max-width: @mobileResolution)  {
            display: block;
         }

         &-update {
            @media (max-width: @mobileResolution)  {
               display: none !important;
            }
         }

         &-delete {
            @media (max-width: @mobileResolution)  {
               display: none !important;
            }
         }
      }

      &-current {
         background: @accentColorLight;
         font-weight: bold;
      }

      & th {
         color: @borderColor;
         font-weight: normal;
         text-align: left;
         padding: 0 12px;
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
         padding: 0 12px;
         height: 40px;
      }
   }
}
</style>
