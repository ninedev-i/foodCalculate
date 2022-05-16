<template>
   <common-dialog
      :is-opened="isOpened"
      heading="Настройки"
      accept-caption="Сохранить"
      decline-caption="Отмена"
      @close="closeSettings"
      @accept="updateSettings"
   >
      <div class="settingsDialog">
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
      <info-alert>Количество ингредиентов умножается на коэффициент и количество человек.</info-alert>
   </common-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import InfoAlert from '@/components/common/Alert.vue';
import CommonDialog from '@/components/common/Dialog.vue';
import CommonInput from '@/components/common/Input.vue';
import { useSettingsStore } from '@/stores/settings';

defineComponent({
   name: 'SettingsDialog',
});

const settingsStore = useSettingsStore();
const editedPeople = ref(settingsStore.people);
const editedCoefficient = ref(settingsStore.coefficient);
const isOpened = ref(false);

const closeSettings = () => {
   isOpened.value = false;
   editedPeople.value = settingsStore.people;
   editedCoefficient.value = settingsStore.coefficient;
};

const updateSettings = () => {
   settingsStore.changePeople(editedPeople.value);
   settingsStore.changeCoefficient(editedCoefficient.value);
   closeSettings();
};

onMounted(() => {
   isOpened.value = true;
});
</script>

<style scoped lang="less">
.settingsDialog {
   display: grid;
   width: 350px;
   grid-template-columns: auto auto auto auto;
   align-items: baseline;
   gap: 6px 12px;
   margin-bottom: 16px;
}
</style>