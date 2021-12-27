<template>
   <section class="addIngredient">
      <IconButton
         v-if="!isEdited"
         caption="Добавить"
         size="26px"
         :title="!isAuthenticated ? 'Авторизуйтесь чтобы добавлять свои ингредиенты' : ''"
         :disabled="!isAuthenticated"
         @click="toggleIsEdited"
      >
         <PlusIcon />
      </IconButton>
      <div v-else class="addIngredient-form">
         <Input
            class="addIngredient-input"
            autofocus
            type="text"
            input-width="110px"
            placeholder="Ингредиент"
            padding="4px"
            :value="ingredientCaption"
            @change="(ev) => ingredientCaption = ev.target.value"
         />
         <Input
            class="addIngredient-input"
            type="text"
            input-width="20px"
            placeholder="ед. измерения"
            padding="4px"
            :value="countCaption"
            @change="(ev) => countCaption = ev.target.value"
         />

         <IconButton
            title="Добавить"
            size="26px"
            :rounded="false"
            @click="saveIngredient()"
         >
            <PlusIcon />
         </IconButton>
      </div>
   </section>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import PlusIcon from '@/assets/plus.svg';
import Input from '@/components/common/Input.vue';
import IconButton from '@/components/common/IconButton.vue';

defineComponent({
   name: 'AddIngredient',
});

const props = defineProps({
   type: {
      type: Number,
   }
});

const store = useStore();

const isAuthenticated = computed(() => !!store.state.user.email);
const isEdited = ref(false);
const ingredientCaption = ref('');
const countCaption = ref('г');

const toggleIsEdited = (): void => {
   isEdited.value = !isEdited.value;
};

const saveIngredient = (): void => {
   isEdited.value = false;
   store.dispatch('saveIngredient', {
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
