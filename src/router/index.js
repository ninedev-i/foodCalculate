import {createRouter, createWebHistory} from 'vue-router';
import Summary from '@/components/Summary';
import Timeline from '@/components/Timeline';

const routes = {
    history: createWebHistory(),
    routes: [
        {path: '/', component: Timeline},
        {path: '/summary', component: Summary},
    ],
};

export default createRouter(routes);
