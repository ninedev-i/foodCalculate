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
      <div class="addIngredient-form" v-else>
         <Input
            class="addIngredient-input"
            autofocus
            type="text"
            inputWidth="110px"
            placeholder="Ингредиент"
            padding="4px"
            :value="ingredientCaption"
            @change="(ev) => ingredientCaption = ev.target.value"
         />
         <Input
            class="addIngredient-input"
            type="text"
            inputWidth="20px"
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

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';
import IconButton from '@/components/common/IconButton.vue';
import PlusIcon from '@/assets/plus.svg?component';

export default {
   name: 'AddIngredient',
   props: {
      type: {
         type: Number,
      }
   },
   components: {
      Input,
      Button,
      IconButton,
      PlusIcon,
   },
   setup(props) {
      const store = useStore();

      const ingredients = computed(() => store.state.food.ingredients);
      const isAuthenticated = computed(() => !!store.state.user.email);
      const isEdited = ref(false);
      const ingredientCaption = ref('');
      const countCaption = ref('г');

      const toggleIsEdited = () => isEdited.value = !isEdited.value;
      const saveIngredient = () => {
         isEdited.value = false;
         store.dispatch('saveIngredient', {title: ingredientCaption.value, count_caption: countCaption.value, type: props.type});
         ingredientCaption.value = '';
      };

      return {
         isEdited,
         toggleIsEdited,
         ingredients,
         isAuthenticated,
         ingredientCaption,
         countCaption,
         saveIngredient,
      };
   },
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
