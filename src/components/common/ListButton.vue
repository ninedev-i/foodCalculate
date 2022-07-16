<template>
   <popup
      :text="!isAuthenticated ? 'Авторизуйтесь чтобы сохранять меню' : 'Сохраненные меню'"
   >
      <icon-button
         class="list-button"
         size="22px"
         :filled="false"
         @click="userMenuOpened = true"
      >
         <list-icon />
      </icon-button>
   </popup>
   <Suspense>
      <user-menu-dialog v-if="userMenuOpened" @close="userMenuOpened = null" />
   </Suspense>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue';
import ListIcon from '@/assets/list.svg';
import IconButton from '@/components/common/IconButton.vue';
import Popup from '@/components/common/Popup.vue';
import { useUserStore } from '@/stores/user';

const UserMenuDialog = defineAsyncComponent(() => import('@/components/dialogs/UserMenu.vue'));

const userStore = useUserStore();
const isAuthenticated = computed(() => !!userStore.email);
const iconColor = computed(() => isAuthenticated.value ? '#a2a6f1' : '#ddd');
const userMenuOpened = ref(false);
</script>

<style lang="less">
@import "../../assets/constants.less";

.list-button {
   svg {
      fill: v-bind(iconColor);
   }
}
</style>
