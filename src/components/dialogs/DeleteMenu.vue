<template>
   <common-dialog
      :is-opened="isOpened"
      heading="Удаление меню"
      @accept="userStore.deleteMenu(menuId)"
   >
      Вы действительно хотите удалить это меню?
   </common-dialog>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import CommonDialog from '@/components/common/Dialog.vue';
import { useUserStore } from '@/stores/user';

defineComponent({
   name: 'DeleteMenuDialog',
});

defineProps({
   menuId: {
      type: Number,
      required: true
   },
});

const userStore = useUserStore();
const isOpened = ref(false);

onMounted(() => {
   isOpened.value = true;
});
</script>
