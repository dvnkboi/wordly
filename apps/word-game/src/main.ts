import { createApp } from 'vue'
import App from './App.vue'
import Router from './router';
import localforage from 'localforage';

const app = createApp(App);

app.config.globalProperties.$lf = localforage;

app.use(Router).mount('#app')
