import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/utils';

export const routes = {
   home: '/',
   add: '/add',
   auth: '/auth-:token',
   profile: '/profile',
   summary: '/summary',
};

export default createRouter({
   history: createWebHistory(),
   routes: [
      { path: routes.auth, component: () => import('@/views/Timeline.vue'), beforeEnter: auth },
      { path: routes.home, component: () => import('@/views/Timeline.vue'), meta: { isWithSidebar: true } },
      { path: routes.profile, component: () => import('@/views/Profile.vue') },
      { path: routes.summary, component: () => import('@/views/Summary.vue') },
   ],
});
