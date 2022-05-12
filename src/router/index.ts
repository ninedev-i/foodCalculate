import { createRouter, createWebHistory } from 'vue-router';

export const routes = {
   home: '/',
   add: '/add',
   profile: '/profile',
   summary: '/summary',
};

export default createRouter({
   history: createWebHistory(),
   routes: [
      { path: routes.home, component: () => import('@/views/Timeline.vue'), meta: { isWithSidebar: true } },
      { path: routes.profile, component: () => import('@/views/Profile.vue') },
      { path: routes.summary, component: () => import('@/views/Summary.vue') },
   ],
});
