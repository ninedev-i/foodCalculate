<template>
   <popup :text="!isAuthenticated ? 'Авторизуйтесь чтобы сохранять меню' : 'Сохранить меню'">
      <icon-button
         v-if="isAuthenticated && menu?.id"
         class="save-button"
         size="22px"
         :filled="false"
         :disabled="!isDataChanged"
         @click="saveAction"
      >
         <save-icon />
      </icon-button>
   </popup>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import IconButton from '@/components/common/IconButton.vue';
import Popup from '@/components/common/Popup.vue';
import SaveIcon from '@/assets/save.svg';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';

const userStore = useUserStore();
const foodStore = useFoodStore();
const settingsStore = useSettingsStore();
const menu = computed(() => userStore.currentMenu);
const isDataChanged = computed(() => settingsStore.isDataChanged);
const iconColor = computed(() => isDataChanged.value ? '#a2a6f1' : '#ddd');
const isAuthenticated = computed(() => !!userStore.email);

const saveAction = (): void => {
   const data = {
      id: menu.value.id,
      title: menu.value.title,
      settings: JSON.stringify({ people: settingsStore.people, days: settingsStore.days }),
      content: JSON.stringify(foodStore.timetable),
   };
   userStore.updateMenu(data);
};
</script>

<style lang="less">
@import "../../assets/constants.less";

.save-button {
   svg {
      fill: v-bind(iconColor);
   }

   @media (max-width: @mobileResolution)  {
      display: none;
   }
}
</style>
