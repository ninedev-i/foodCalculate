<template>
   <dialog ref="dialog" class="dialog" @close="emit('close')">
      <h4 class="dialog-title">{{ heading }}</h4>
      <button v-if="isHideActions" class="dialog-close" @click="decline">
         <cross-icon />
      </button>

      <div class="dialog-content">
         <slot />
      </div>

      <div class="dialog-actions">
         <common-button v-if="!isHideActions" appearance="outlined" @click="decline">{{ declineCaption }}</common-button>
         <common-button v-if="!isHideActions" @click="accept">{{ acceptCaption }}</common-button>
      </div>
   </dialog>
</template>

<script lang="ts" setup>
import { defineComponent, ref, watch } from 'vue';
import CommonButton from '@/components/common/Button.vue';
import CrossIcon from '@/assets/cross.svg';

defineComponent({
   name: 'Dialog',
});

const props = defineProps({
   isOpened: {
      type: Boolean,
      default: false
   },
   heading: {
      type: String,
   },
   acceptCaption: {
      type: String,
      default: 'Да'
   },
   declineCaption: {
      type: String,
      default: 'Нет'
   },
   isHideActions: {
      type: Boolean,
      default: false
   },
});

const emit = defineEmits(['accept', 'close']);

const dialog = ref(null);

watch(() => props.isOpened, (isOpened) => {
   if (isOpened) {
      dialog.value.showModal();
   }
});

const accept = () => {
   emit('accept');
   dialog.value.close();
};

const decline = () => dialog.value.close();
</script>

<style lang="less">
@import "../../assets/constants.less";

.dialog {
   border: 0;
   box-shadow: @boxShadow;
   padding: 20px;
   top: 50%;
   left: 50%;
   -ms-transform: translateX(-50%) translateY(-50%);
   transform: translateX(-50%) translateY(-50%);

   &::backdrop {
      background: #00000080;
   }

   &-title {
      margin-bottom: 6px;
   }

   &-content {
      font-size: 15px;
   }

   &-actions {
      display: flex;
      width: 220px;
      gap: 12px;
      margin-top: 12px;
      float: right;
   }

   &-close {
      all: unset;
      width: 14px;
      height: 14px;
      fill: @iconAccentedColor;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      margin: 12px;
   }
}

</style>
