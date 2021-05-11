<template>
   <div class="config-container">
      <nav class="config-routes">
         <router-link class="config-link" active-class="config-link-active" :to="routes.profile">Профиль</router-link>
         <router-link class="config-link" active-class="config-link-active" :to="routes.home">Меню</router-link>
         <router-link class="config-link" active-class="config-link-active" :to="routes.summary" :people="{people: +people}">Итого</router-link>
      </nav>

      <div class="config-settings">
         <Input
            id="people"
            class="config-input"
            min="1"
            max="500"
            step="1"
            type="number"
            inputWidth="30px"
            textAlign="center"
            :value="people"
            :label="getPeopleCaption(people)"
            @input="changePeople($event.target.value)"
         />
<!--         <Input
            id="days"
            class="config-input"
            step="1"
            min="1"
            max="500"
            type="number"
            inputWidth="30px"
            textAlign="center"
            :value="days"
            :label="getDaysCaption(days)"
            @input="changeDays($event.target.value)"
         />-->
      </div>
   </div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from 'vuex';
import Input from '@/components/common/Input.vue';
import {routes} from '@/router';

export default {
   name: 'Config',
   components: {
      Input,
   },
   setup() {
      const store = useStore();

      const days = computed(() => store.state.days);
      const people = computed(() => store.state.people);

      const changeDays = (val) => store.dispatch('changeDays', val);
      const changePeople = (val) => store.dispatch('changePeople', val);
      const getPeopleCaption = (val) => {
         let cases = [2, 0, 1, 1, 1, 2];
         return ['человек', 'человека', 'человек'][(val % 100 > 4 && val % 100 < 20)
            ? 2
            : cases[(val % 10 < 5) ? val % 10 :5]];
      };
      const getDaysCaption = (val) => {
         let cases = [2, 0, 1, 1, 1, 2];
         return ['день', 'дня', 'дней'][(val % 100 > 4 && val % 100 < 20)
            ? 2
            : cases[(val % 10 < 5) ? val % 10 :5]];
      };

      return {
         days,
         routes,
         people,
         changeDays,
         changePeople,
         getDaysCaption,
         getPeopleCaption,
      };
   },
};
</script>

<style lang="less">
@import "../assets/constants.less";

.config {
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
         clip-path: polygon(0 0, 0 48px, 20px 48px, 0px 0px);
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

         &.config-link-active {
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
