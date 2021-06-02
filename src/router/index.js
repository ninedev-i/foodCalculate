import {createRouter, createWebHistory} from 'vue-router';

export const routes = {
   home: '/',
   add: '/add',
   profile: '/profile',
   summary: '/summary',
};

export default createRouter({
   history: createWebHistory(),
   routes: [
      {path: routes.home, component: () => import('@/views/Timeline.vue')},
      {path: routes.profile, component: () => import('@/views/Auth.vue')},
      {path: routes.summary, component: () => import('@/views/Summary.vue')},
   ],
});
