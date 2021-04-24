import {createRouter, createWebHistory} from 'vue-router';
import Summary from '@/views/Summary.vue';
import Timeline from '@/views/Timeline.vue';
import AddDishes from '@/views/AddDishes.vue';

export default createRouter({
   history: createWebHistory(),
   routes: [
      {path: '/', component: Timeline},
      {path: '/add', component: AddDishes},
      {path: '/summary', component: Summary},
   ],
});
