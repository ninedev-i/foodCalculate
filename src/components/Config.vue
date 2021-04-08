<template>
   <div class="config-container">
      <div class="config-settings">
         <auth />
         <div>
            <input
               id="people"
               class="config-input"
               type="number"
               step="1"
               v-bind:value="people"
               @input="changePeople($event.target.value)"
               min="1"
            />
            <label class="config-label" for="people">{{getPeopleCaption(people)}}</label>
         </div>
         <div>
            <input
               id="days"
               class="config-input"
               type="number"
               step="1"
               min="1"
               v-bind:value="days"
               @input="changeDays($event.target.value)"
            />
            <label class="config-label" for="days">{{getDaysCaption(days)}}</label>
         </div>
      </div>
      <div class="config-routes">
         <router-link class="config-link" active-class="config-link-active" to="/">Меню</router-link>
         <router-link class="config-link" active-class="config-link-active" to="/add">Добавить блюда</router-link>
         <router-link class="config-link" active-class="config-link-active" to="/summary" :people="{people: +people}">Итого</router-link>
      </div>
   </div>
</template>

<script>
import {computed} from 'vue';
import {useStore} from 'vuex';
import auth from '@/components/Auth.vue';

export default {
   name: 'Config',
   components: {
      auth,
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
.config {
   &-container {
      display: flex;
      background: aqua;
      justify-content: space-between;
      align-items: baseline;

      a {
         color: #2c3e50;
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
      width: 30px;
      text-align: center;
      margin-right: 6px;
   }

   &-routes {
      display: flex;
   }

   &-link {
      height: 100%;
      padding: 12px;
      display: flex;
      align-items: center;
      &:hover {
         background: #0ce4e4;
         text-decoration: underline;

         &.config-link-active {
            background: #04f0f0;
            text-decoration: none;
            cursor: default;
         }
      }
      &-active {
         background: #04f0f0;
         text-decoration: none;
      }
   }
}
</style>
