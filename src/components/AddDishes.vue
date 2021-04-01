<template>
   <div class="addDishContainer">
      <div class="ingredientContainer">
         <h2>Добавить ингредиент</h2>
         <input type="text" class="ingredientInput" v-model="ingredientCaption" placeholder="Название" autofocus />
         <input type="text" class="ingredientInput" v-model="countCaption" placeholder="ед. измерения" />

         <button type="button" class="ingredientButton" @click="saveIngredient()">Добавить ингредиент</button>
      </div>
   </div>
</template>

<script>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';

export default {
   name: 'AddDishes',
   setup() {
      const store = useStore();

      const ingredients = computed(() => store.state.ingredients);
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
.ingredientInput {
   width: 200px;
   padding: 3px;
   margin-bottom: 6px;
}
.ingredientButton {
   width: 210px;
   padding: 5px;
}
</style>
