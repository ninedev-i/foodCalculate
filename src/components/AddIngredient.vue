<template>
   <section class="addIngredient">
      <icon-button
         v-if="!isEdited"
         caption="Добавить"
         size="26px"
         :title="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои ингредиенты' : ''"
         :disabled="!isAuthenticated"
         @click="toggleIsEdited"
      >
         <plus-icon />
      </icon-button>
      <form v-else class="addIngredient-form" @submit.prevent="saveIngredient">
         <common-input
            v-model="ingredientCaption"
            class="addIngredient-input"
            label-id="add-ingredient"
            autofocus
            type="text"
            input-width="110px"
            placeholder="Ингредиент"
            padding="4px"
         />
         <common-input
            v-model="countCaption"
            class="addIngredient-input"
            type="text"
            input-width="20px"
            placeholder="ед. измерения"
            padding="4px"
         />

         <icon-button
            title="Добавить"
            size="26px"
            :rounded="false"
         >
            <plus-icon />
         </icon-button>
      </form>
   </section>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import PlusIcon from '@/assets/plus.svg';
import CommonInput from '@/components/common/Input.vue';
import IconButton from '@/components/common/IconButton.vue';
import { useUserStore } from '@/stores/user';
import { useFoodStore } from '@/stores/food';

defineComponent({
   name: 'AddIngredient',
});

const props = defineProps({
   type: {
      type: Number,
   }
});

const userStore = useUserStore();
const foodStore = useFoodStore();

const isAuthenticated = computed(() => !!userStore.email);
const isEdited = ref(false);
const ingredientCaption = ref('');
const countCaption = ref('г');

const toggleIsEdited = (): void => {
   isEdited.value = !isEdited.value;
};

const saveIngredient = (): void => {
   if (!ingredientCaption.value || !countCaption.value) {
      return;
   }
   isEdited.value = false;
   foodStore.saveIngredient({
      title: ingredientCaption.value,
      count_caption: countCaption.value,
      type: props.type
   });
   ingredientCaption.value = '';
};
</script>

<style lang="less">
@import "../assets/constants.less";

.addIngredient {
   display: flex;
   flex-direction: column;
   margin: 0 6px;

   &-form {
      margin-top: 6px;
      display: flex;
   }

   &-input {
      margin-right: 4px;
   }
}
</style>
