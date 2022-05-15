<template>
   <div class="settings" @click="isDialogOpened = true">
      <span>{{ settingsStore.people }} {{ peopleCaption }},</span>
      <span>% {{ settingsStore.coefficient }}</span>
      <button class="settings-edit" title="Изменить настройки">
         <edit-icon />
      </button>
   </div>

   <common-dialog
      :is-opened="isDialogOpened"
      heading="Настройки"
      accept-caption="Сохранить"
      decline-caption="Отмена"
      @close="closeSettings"
      @accept="updateSettings"
   >
      <div class="settings-dialog">
         <label for="people">Кол-во человек</label>
         <common-input
            :value="editedPeople"
            type="number"
            min="1"
            max="500"
            step="1"
            padding="6px 12px"
            label-id="people"
            input-width="20px"
            @changeValue="(value) => editedPeople = value"
         />
         <label for="coefficient">Коэффициент</label>
         <common-input
            :value="editedCoefficient"
            type="number"
            min="0.1"
            max="2"
            step="0.1"
            padding="6px 12px"
            label-id="coefficient"
            input-width="20px"
            @changeValue="(value) => editedCoefficient = value"
         />
      </div>
      <info-alert text="Количество ингредиентов умножается на коэффициент и количество человек." />
   </common-dialog>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import CommonInput from '@/components/common/Input.vue';
import CommonDialog from '@/components/common/Dialog.vue';
import InfoAlert from '@/components/common/Alert.vue';
import EditIcon from '@/assets/edit.svg';
import { useSettingsStore } from '@/stores/settings';
const isDialogOpened = ref(false);

defineComponent({
   name: 'Settings',
});

const settingsStore = useSettingsStore();
const editedPeople = ref(settingsStore.people);
const editedCoefficient = ref(settingsStore.coefficient);

const peopleCaption = computed((): string => {
   const people = settingsStore.people;
   let cases = [2, 0, 1, 1, 1, 2];
   return ['человек', 'человека', 'человек'][(people % 100 > 4 && people % 100 < 20)
      ? 2
      : cases[(people % 10 < 5) ? people % 10 :5]];
});

const closeSettings = () => {
   isDialogOpened.value = false;
   editedPeople.value = settingsStore.people;
   editedCoefficient.value = settingsStore.coefficient;
};

const updateSettings = () => {
   settingsStore.changePeople(editedPeople.value);
   settingsStore.changeCoefficient(editedCoefficient.value);
   closeSettings();
};
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
   padding: 0 12px;
   gap: 10px;
   cursor: pointer;

   &-edit {
      all: unset;
      width: 12px;
      fill: @iconAccentedColor;
   }

   &-dialog {
      display: grid;
      width: 350px;
      grid-template-columns: auto auto auto auto;
      align-items: baseline;
      gap: 6px 12px;
      margin-bottom: 16px;
   }
}
</style>
