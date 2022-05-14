<template>
   <icon-button
      v-if="isAuthenticated && menu?.id"
      v-memo="[isAuthenticated, menu?.id]"
      class="save-button"
      size="22px"
      :filled="false"
      title="Сохранить"
      :disabled="!isDataChanged"
      @click="saveAction"
   >
      <save-icon />
   </icon-button>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue';
import IconButton from '@/components/common/IconButton.vue';
import SaveIcon from '@/assets/save.svg';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';
import { useSettingsStore } from '@/stores/settings';

defineComponent({
   name: 'SaveButton',
});

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
