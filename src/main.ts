import { createApp } from 'vue';
import App from './App.vue';
import createRouter from './router';
import createStore from './store';

const app = createApp(App);
app.use(createStore);
app.use(createRouter);
app.mount('#app');
