<template>
   <button
      v-if="!isEdited"
      class="editableInput-button"
      title="Редактировать"
      @click="isEdited = true"
   >
      {{ value }}
   </button>
   <form v-else class="editableInput-container" @keyup.esc="cancel" @submit.prevent="save">
      <common-input
         v-model="editedValue"
         type="text"
         input-width="fit-content"
         padding="5px 8px"
         autofocus
      />

      <common-button
         class="editableInput-action"
         appearance="outlined"
         margin="0 0 0 6px"
         title="Отменить"
         @click="cancel"
      >
         <cross-icon />
      </common-button>

      <common-button
         class="editableInput-action"
         margin="0 0 0 6px"
         title="Сохранить"
         type="submit"
      >
         <accept-icon />
      </common-button>
   </form>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import AcceptIcon from '@/assets/accept.svg';
import CrossIcon from '@/assets/cross.svg';
import CommonButton from '@/components/common/Button.vue';
import CommonInput from '@/components/common/Input.vue';

defineComponent({
   name: 'EditableInput',
});

const props = defineProps({
   value: String
});

const emit = defineEmits(['save']);
const editedValue = ref(props.value);
const isEdited = ref(false);

const cancel = () => {
   editedValue.value = props.value;
   isEdited.value = false;
};

const save = () => {
   isEdited.value = false;
   emit('save', editedValue.value.trim());
};
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.editableInput {
   &-button {
      all: unset;
      cursor: text;
      border-bottom: 1px dashed @borderColor;
   }

   &-container {
      display: flex;
   }

   &-action {
      width: 33px !important;
   }
}
</style>
