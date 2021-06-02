<template>
   <section class="addIngredient">
      <IconButton v-if="!isEdited" caption="Добавить" size="26px" @click="toggleIsEdited">
         <PlusIcon />
      </IconButton>
      <div class="addIngredient-form" v-else>
         <Input
            autofocus
            type="text"
            inputWidth="10px"
            placeholder="Название"
            padding="4px"
            :value="ingredientCaption"
            @change="(ev) => ingredientCaption = ev.target.value"
         />
         <Input
            type="text"
            inputWidth="200px"
            placeholder="ед. измерения"
            padding="4px"
            :value="countCaption"
            @change="(ev) => countCaption = ev.target.value"
         />

         <Button
            type="button"
            width="210px"
            @click="saveIngredient()"
         >
            Добавить ингредиент
         </Button>
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
   components: {
      Input,
      Button,
      IconButton,
      PlusIcon,
   },
   setup() {
      const store = useStore();

      const ingredients = computed(() => store.state.food.ingredients);
      const isEdited = ref(false);
      const ingredientCaption = ref('');
      const countCaption = ref('г');

      const toggleIsEdited = () => isEdited.value = !isEdited.value;
      const saveIngredient = () => {
         store.dispatch('saveIngredient', {title: ingredientCaption.value, count_caption: countCaption.value});
         ingredientCaption.value = '';
      };

      return {
         isEdited,
         toggleIsEdited,
         ingredients,
         ingredientCaption,
         countCaption,
         saveIngredient,
      };
   },
};
</script>

<style lang="less">
.addIngredient {
   display: flex;
   flex-direction: column;
   margin: 0 6px;

   &-form {
      display: flex;
   }
}
</style>
