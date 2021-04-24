<template>
   <div class="config-container">
      <div class="config-settings">
         <auth />
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
         <Input
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
         />
      </div>
      <nav class="config-routes">
         <router-link class="config-link" active-class="config-link-active" to="/">Меню</router-link>
         <router-link class="config-link" active-class="config-link-active" to="/add">Добавить блюда</router-link>
         <router-link class="config-link" active-class="config-link-active" to="/summary" :people="{people: +people}">Итого</router-link>
      </nav>
   </div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from 'vuex';
import auth from '@/components/Auth.vue';
import Input from '@/components/common/Input.vue';

export default {
   name: 'Config',
   components: {
      auth,
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

      a {
         color: @fontColor;
      }
   }

   &-settings {
      margin-left: 12px;
      display: flex;
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
      &:hover {
         border-bottom: 4px solid @accentColor;

         &.config-link-active {
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
