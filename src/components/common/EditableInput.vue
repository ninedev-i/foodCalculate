<template>
   <button
      v-if="!isEdited"
      class="editableInput-button"
      title="Редактировать"
      @click="isEdited = true"
   >
      {{ value }}
   </button>

   <div v-else class="editableInput-container">
      <common-input
         type="text"
         input-width="fit-content"
         padding="5px 8px"
         :autofocus="true"
         :value="editedValue"
         @change="(ev) => editedValue = ev.target.value"
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
         @click="save"
      >
         <expand-arrow-icon />
      </common-button>
   </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import CommonButton from '@/components/common/Button.vue';
import CommonInput from '@/components/common/Input.vue';
import CrossIcon from '@/assets/cross.svg';
import ExpandArrowIcon from '@/assets/expandArrow.svg';

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
   isEdited.value = false;
   editedValue.value = props.value;
};

const save = () => {
   isEdited.value = false;
   emit('save', editedValue.value);
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
