<template>
   <section class="summary">
      <h1>Все ингредиенты</h1>
      <div class="summary-table">
         <template v-for="dish of summary.keys()" :key="dish">
            <div class="summary-table-title">{{summary.get(dish).title}}</div>
            <div class="summary-table-quantity">{{summary.get(dish).quantity}}</div>
            <div class="summary-table-countCaption">{{summary.get(dish).countCaption}}.</div>
         </template>
      </div>
   </section>
</template>

<script>
import {useStore} from 'vuex';
import {computed} from 'vue';

export default {
   name: 'Summary',
   setup() {
      const store = useStore();
      const ingredientById = computed(() => store.getters.ingredientById);
      const summary = computed(() => store.getters.getSummaryIngredients());

      return {
         summary,
         ingredientById,
      };
   }
};
</script>

<style lang="less">
@import "../assets/constants.less";

.summary {
   margin: 0 12px;

   &-table {
      width: 350px;
      display: grid;
      grid-template-columns: 1fr 50px 30px;

      div {
         padding: 4px 8px;
      }

      &-title:nth-child(odd),
      &-quantity:nth-child(even),
      &-countCaption:nth-child(odd) {
         background: @accentColorLight;
      }

      &-title {
         //text-align: right;
      }

      &-quantity {
         text-align: right;
      }

      &-countCaption {
         text-align: left;
         padding-left: 0 !important;
      }
   }
}
</style>
