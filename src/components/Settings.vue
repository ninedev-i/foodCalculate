<template>
   <popup text="Настройки">
      <div class="settings" @click="isDialogOpened = true">
         <span>{{ settingsStore.people }} {{ peopleCaption }},</span>
         <span>% {{ settingsStore.coefficient }}</span>
         <button class="settings-edit" title="Изменить настройки">
            <edit-icon />
         </button>
      </div>
   </popup>

   <settings-dialog v-if="isDialogOpened" @close="isDialogOpened = false" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import EditIcon from '@/assets/edit.svg';
import Popup from '@/components/common/Popup.vue';
import { useSettingsStore } from '@/stores/settings';

const SettingsDialog = defineAsyncComponent(() => import('@/components/dialogs/Settings.vue'));

const isDialogOpened = ref(false);
const settingsStore = useSettingsStore();

const peopleCaption = computed((): string => {
   const people = settingsStore.people;
   let cases = [2, 0, 1, 1, 1, 2];
   return ['человек', 'человека', 'человек'][(people % 100 > 4 && people % 100 < 20)
      ? 2
      : cases[(people % 10 < 5) ? people % 10 :5]];
});
</script>

<style scoped lang="less">
@import "../assets/constants.less";

.settings {
   background: #fff;
   font-size: 14px;
   border-radius: 16px;
   filter: drop-shadow(0 0 10px #04040412);
   align-items: center;
   display: flex;
   padding: 7px 12px;
   gap: 10px;
   cursor: pointer;
   height: 34px;
   box-sizing: border-box;

   @media (max-width: @mobileResolution)  {
      display: none;
   }

   @media print {
      display: none;
   }

   &-edit {
      all: unset;
      width: 12px;
      fill: @iconAccentedColor;
   }
}
</style>
