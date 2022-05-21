<template>
   <common-dialog
      :is-opened="isOpened"
      heading="Добавление своего ингредиента"
      accept-caption="Добавить"
      decline-caption="Отменить"
      :before-close="saveIngredient"
   >
      <form ref="form" class="addIngredient-form">
         <div class="addIngredient-inputsWrapper">
            <common-input
               v-model="ingredientCaption"
               autofocus
               type="text"
               input-width="110px"
               placeholder="Ингредиент"
               padding="6px 12px"
            />
            <common-input
               v-model="countCaption"
               type="text"
               input-width="20px"
               placeholder="ед. измерения"
               padding="6px 12px"
            />
         </div>
         <common-select
            v-model="ingredientType"
            :items="ingredientGroups"
         />
      </form>
   </common-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CommonDialog from '@/components/common/Dialog.vue';
import CommonInput from '@/components/common/Input.vue';
import CommonSelect from '@/components/common/Select.vue';
import { useFoodStore } from '@/stores/food';

const foodStore = useFoodStore();
const isOpened = ref(false);
const form = ref(null);
const ingredientCaption = ref('');
const countCaption = ref('г');
const ingredientGroups = computed(() => foodStore.ingredientGroups);
const ingredientType = ref(0);

const saveIngredient = (): boolean => {
   form.value.reportValidity();
   if (!ingredientCaption.value || !countCaption.value) {
      return false;
   }
   foodStore.saveIngredient({
      title: ingredientCaption.value,
      count_caption: countCaption.value,
      type: ingredientType.value,
   });
   return true;
};

onMounted(() => {
   isOpened.value = true;
});
</script>

<style lang="less" scoped>
@import "../../assets/constants.less";

.addIngredient {
   &-form {
      display: flex;
      flex-direction: column;
   }

   &-inputsWrapper {
      display: flex;
      margin-bottom: 12px;
      gap: 12px
   }
}
</style>