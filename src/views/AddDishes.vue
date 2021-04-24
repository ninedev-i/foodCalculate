<template>
   <div class="addDishContainer">
      <div class="ingredientContainer">
         <h2>Добавить ингредиент</h2>
         <Input
            autofocus
            type="text"
            inputWidth="200px"
            placeholder="Название"
            :value="ingredientCaption"
            @change="(ev) => ingredientCaption = ev.target.value"
         />
         <Input
            type="text"
            inputWidth="200px"
            placeholder="ед. измерения"
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
   </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import Input from '@/components/common/Input.vue';
import Button from '@/components/common/Button.vue';

export default {
   name: 'AddDishes',
   components: {
      Input,
      Button,
   },
   setup() {
      const store = useStore();

      const ingredients = computed(() => store.state.food.ingredients);
      const ingredientCaption = ref('');
      const countCaption = ref('г');

      const saveIngredient = () => {
         store.dispatch('saveIngredient', {title: ingredientCaption.value, count_caption: countCaption.value});
         ingredientCaption.value = '';
      };

      return {
         ingredients,
         ingredientCaption,
         countCaption,
         saveIngredient,
      };
   },
};
</script>

<style lang="less">
.addDishContainer {
   margin: 12px 24px;
   display: flex;

   h2 {
      margin-top: 0;
   }
}
.ingredientContainer {
   display: flex;
   flex-direction: column;
   margin-right: 24px;
}
</style>
