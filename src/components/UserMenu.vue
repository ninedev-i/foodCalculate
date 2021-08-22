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
               <span v-if="!menu.is_current">{{menu.title}}</span>

               <common-input
                  v-if="menu.is_current && inputs[menu.id]"
                  :className="`${menu.is_current ? 'userMenu-table-currentItem' : ''}`"
                  borderBottom
                  type="text"
                  inputWidth="200px"
                  :value="inputs[menu.id]"
                  @input="(ev) => handleInput(ev.target.value, menu.id)"
               />
            </td>
            <td>{{getFormattedDate(menu.updated_at)}}</td>
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

<script>
import {computed} from 'vue';
import {useStore} from 'vuex';
import CommonButton from '@/components/common/Button.vue';
import CommonInput from '@/components/common/Input.vue';

export default {
   name: 'UserMenu',
   components: {
      CommonButton,
      CommonInput,
   },
   setup() {
      const store = useStore();
      const menus = computed(() => store.state.user.menus);
      const inputs = computed(() => store.state.user.menusForInput);

      // TODO поле ввода по клику. по ховеру карандаш

      const isTitleChanged = computed(() => {
         const current = store.state.user.menus.find(item => item.is_current);
         return current.title !== inputs[current.id];
      });
      const isDataChanged = computed(() => {
         const current = store.state.user.menus.find(item => item.is_current);
         if (current) {
            const isMenuChanged = store.state.food.isTimetableChanged;
            const isDaysChanged = current.settings.days !== store.state.days;
            const isPeopleChanged = current.settings.people !== store.state.people;

            return isMenuChanged || isDaysChanged || isPeopleChanged;
         }
         return false;
      });

      const handleInput = (value, id) => {
         store.dispatch('setMenusForInput', {value, id});
      };

      const addMenu = () => {
         const data = {
            title: 'Поход',
            settings: JSON.stringify({people: store.state.people, days: store.state.days}),
            content: JSON.stringify(store.state.food.timetable),
         };
         store.dispatch('addMenu', data);
      };
      const updateItem = (id) => {
         const data = {
            id,
            title: inputs.value[id],
            settings: JSON.stringify({people: store.state.people, days: store.state.days}),
            content: JSON.stringify(store.state.food.timetable),
         };
         store.dispatch('updateMenu', data);
      };
      const deleteItem = (id) => {
         store.dispatch('deleteMenu', id);
      };
      const chooseItem = (id) => {
         store.dispatch('chooseMenu', id);
      };
      const getFormattedDate = (date) => {
         const currentDate = new Date(date);

         return currentDate.toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
         });
      };

      return {
         menus,
         addMenu,
         updateItem,
         inputs,
         handleInput,
         deleteItem,
         chooseItem,
         isTitleChanged,
         isDataChanged,
         getFormattedDate,
      };
   }
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
