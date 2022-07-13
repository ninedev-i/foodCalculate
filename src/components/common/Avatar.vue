<template>
   <div class="avatar">
      <span v-if="char">{{ char }}</span>
      <user-icon v-else class="avatar-user" />
   </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import UserIcon from '@/assets/user.svg';

const props = defineProps({
   name: {
      type: String,
      default: ''
   },
});

const char = computed(() => props.name ? props.name[0] : '');

</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.avatar {
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 20px;
   text-align: center;
   padding: 6px;
   font-size: 14px;
   color: @iconAccentedColor;
   outline: 1.5px solid @iconAccentedColor;
   font-weight: bold;
   text-transform: uppercase;
   width: 13px;
   height: 13px;

   &-user {
      width: 13px;
      height: 13px;
   }
}
</style>
