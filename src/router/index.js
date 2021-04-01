import {createRouter, createWebHistory} from 'vue-router';
import Summary from '@/components/Summary.vue';
import Timeline from '@/components/Timeline.vue';
import AddDishes from '@/components/AddDishes.vue';

export default createRouter({
   history: createWebHistory(),
   routes: [
      {path: '/', component: Timeline},
      {path: '/add', component: AddDishes},
      {path: '/summary', component: Summary},
   ],
});
