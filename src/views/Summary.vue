<template>
   <section class="summary">
      <div class="summary-header">
         <h1>Итого</h1>
         <print-button />
      </div>

      <template v-if="!hasDishesInMenu">
         <p>Здесь пока ничего нет.</p>
         <p>Добавьте блюда в меню, чтобы подсчитать количество ингредиентов.</p>
      </template>

      <template v-for="(group, i) in summaryGrouped" :key="i">
         <div v-if="group.items.length" class="summary-table-group">
            <div class="summary-table-group-title">{{ group.name }}</div>
            <div class="summary-table">
               <template v-for="(item, key) in group.items" :key="key">
                  <div class="summary-table-title">
                     <input type="checkbox" class="summary-checkbox">
                     {{ item.title }}
                  </div>
                  <div class="summary-table-quantity">{{ Math.round(item.quantity * people * coefficient) }}</div>
                  <div class="summary-table-countCaption">{{ item.countCaption }}</div>
               </template>
            </div>
         </div>
      </template>
   </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import PrintButton from '@/components/common/PrintButton.vue';
import { useSettingsStore } from '@/stores/settings';
import { useFoodStore } from '@/stores/food';

const settingsStore = useSettingsStore();
const foodStore = useFoodStore();
const people = computed(() => settingsStore.people);
const coefficient = computed(() => settingsStore.coefficient);
const summaryGrouped = computed(() => foodStore.getSummaryGrouped);
const hasDishesInMenu = computed(() => foodStore.hasDishesInMenu);
</script>

<style lang="less">
@import "../assets/constants.less";

.summary {
   margin: 0 12px;

   &-header {
      display: flex;
      align-items: center;

      h1 {
         margin: 0 12px 0 0;
      }
   }

   &-table {
      width: 350px;
      display: grid;
      grid-template-columns: 1fr 50px 30px;

      div {
         padding: 2px 8px 2px 0;
      }

      &-group {
         margin-bottom: 20px;

         &-title {
            margin: 6px 0;
            font-weight: bold;
         }
      }

      &-title:nth-child(odd),
      &-quantity:nth-child(even),
      &-countCaption:nth-child(odd) {
         //background: @accentColorLight;
      }

      &-title:nth-child(even),
      &-quantity:nth-child(odd),
      &-countCaption:nth-child(even) {
         //background: #f3f3f3;
      }

      &-quantity {
         text-align: right;
      }

      &-countCaption {
         text-align: left;
         padding-left: 0 !important;
      }
   }

   &-checkbox {
      display: none;
      margin-right: 8px;
      @media print {
         display: inline-block;
      }
   }
}
</style>
