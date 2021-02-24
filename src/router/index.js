import {createRouter, createWebHistory} from 'vue-router';
import Summary from '@/components/Summary.vue';
import Timeline from '@/components/Timeline.vue';

export default createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: Timeline},
        {path: '/summary', component: Summary},
    ],
});
