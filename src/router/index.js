import {createRouter, createWebHistory} from 'vue-router';
import Summary from '@/views/Summary.vue';
import Timeline from '@/views/Timeline.vue';
import AddDishes from '@/views/AddDishes.vue';
import Auth from '@/components/Auth.vue';

export const routes = {
   home: '/',
   add: '/add',
   profile: '/profile',
   summary: '/summary',
};

export default createRouter({
   history: createWebHistory(),
   routes: [
      {path: routes.home, component: Timeline},
      {path: routes.add, component: AddDishes},
      {path: routes.profile, component: Auth},
      {path: routes.summary, component: Summary},
   ],
});
