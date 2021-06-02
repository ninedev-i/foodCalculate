<template>
   <section class="summary">
      <div class="summary-header">
         <h1>Итого</h1>
         <print-button />
      </div>

      <template v-for="(group, i) in summaryGrouped" :key="i">
         <div class="summary-table-group" v-if="group.items.length">
            <div class="summary-table-group-title">{{group.name}}</div>
            <div class="summary-table">
               <template v-for="(item, i) in group.items" :key="i">
                  <div class="summary-table-title">{{item.title}}</div>
                  <div class="summary-table-quantity">{{item.quantity * people}}</div>
                  <div class="summary-table-countCaption">{{item.countCaption}}.</div>
               </template>
            </div>
         </div>
      </template>
   </section>
</template>

<script>
import {useStore} from 'vuex';
import {computed} from 'vue';
import PrintButton from '@/components/common/PrintButton.vue';

export default {
   name: 'Summary',
   components: {
      PrintButton,
   },
   setup() {
      const store = useStore();
      const people = computed(() => store.state.people);
      const ingredientById = computed(() => store.getters.ingredientById);
      const ingredientGroups = computed(() => store.state.food.ingredientGroups);
      const summary = computed(() => store.getters.getSummaryIngredients());
      const summaryGrouped = computed(() => store.getters.getSummaryGrouped());

      return {
         people,
         summary,
         ingredientById,
         ingredientGroups,
         summaryGrouped,
      };
   }
};
</script>

<style lang="less">
@import "../assets/constants.less";

.summary {
   margin: 0 12px;

   &-header {
      display: flex;

      h1 {
         margin-right: 12px;
      }
   }

   &-table {
      width: 350px;
      display: grid;
      grid-template-columns: 1fr 50px 30px;

      div {
         padding: 4px 8px;
      }

      &-group {
         margin-bottom: 20px;

         &-title {
            margin: 8px;
            font-weight: bold;
         }
      }

      &-title:nth-child(odd),
      &-quantity:nth-child(even),
      &-countCaption:nth-child(odd) {
         background: @accentColorLight;
      }

      &-title:nth-child(even),
      &-quantity:nth-child(odd),
      &-countCaption:nth-child(even) {
         background: #f3f3f3;
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
