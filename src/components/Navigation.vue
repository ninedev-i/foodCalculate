<template>
   <div class="navigation-container">
      <nav class="navigation-routes">
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.profile">Профиль</router-link>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.home">Меню</router-link>
         <router-link class="navigation-link" active-class="navigation-link-active" :to="routes.summary" :people="{people: +people}">Итого</router-link>
      </nav>

      <div class="navigation-settings">
         <common-input
            label-id="people"
            class="navigation-input"
            min="1"
            max="500"
            step="1"
            type="number"
            input-width="30px"
            text-align="center"
            :value="people"
            :label="getPeopleCaption(people)"
            @changeValue="(value) => changePeople(value)"
         />
      </div>
   </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import CommonInput from '@/components/common/Input.vue';
import { routes } from '@/router';

defineComponent({
   name: 'Navigation',
});

const store = useStore();
const people = computed(() => store.state.people);

const changePeople = (val: number): Promise<void> => store.dispatch('changePeople', val);

const getPeopleCaption = (val: number): string => {
   let cases = [2, 0, 1, 1, 1, 2];
   return ['человек', 'человека', 'человек'][(val % 100 > 4 && val % 100 < 20)
      ? 2
      : cases[(val % 10 < 5) ? val % 10 :5]];
};
</script>

<style lang="less">
@import "../assets/constants.less";

.navigation {
   &-container {
      display: flex;
      background: @containerBackground;
      box-shadow: @boxShadowHovered;
      justify-content: space-between;
      align-items: baseline;

      @media print {
         display: none;
      }

      a {
         color: @fontColor;
      }
   }

   &-settings {
      display: flex;
      background: #a2a6f1;
      align-self: stretch;
      align-items: center;
      padding-right: 6px;

      &:before {
         padding-right: 12px;
         display: block;
         content: '';
         background: @containerBackground;
         height: 100%;
         width: 20px;
         clip-path: polygon(1px 48px, 20px 48px, 1px 0);
         margin-left: -1.3px;
      }
   }

   &-label {
      margin-right: 20px;
   }

   &-input {
      margin-right: 6px;
   }

   &-routes {
      display: flex;
   }

   &-link {
      height: 100%;
      padding: 12px 12px 10px 12px;
      display: flex;
      align-items: center;
      .ellipsis();

      // TODO: Нижнее подчеркивание должно различаться у активного элемента и фокусированного
      &:hover {
         font-weight: bold;

         &.navigation-link-active {
            font-weight: normal;
            text-decoration: none;
            cursor: default;
         }
      }
      &-active {
         border-bottom: 4px solid @accentColor;
         text-decoration: none;
      }
   }
}
</style>
