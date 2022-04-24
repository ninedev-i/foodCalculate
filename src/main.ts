import { createApp } from 'vue';
import App from './App.vue';
import createRouter from './router';
import createStores from './stores';

const app = createApp(App);
app.use(createStores);
app.use(createRouter);
app.mount('#app');
