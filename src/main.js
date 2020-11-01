import {createApp} from 'vue';
import createStore from './store';
import createRouter from './router';
import App from './App.vue';

const app = createApp(App);
app.use(createStore);
app.use(createRouter);
app.mount('#app');
