//import './assets/main.css'

import { createApp } from 'vue';
import {createBootstrap} from 'bootstrap-vue-next'

import axios from './util/axios';
import App from './App.vue';
import router from './router/router';
import { createPinia } from 'pinia';

const pinia = createPinia();
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(createBootstrap())
app.use(router);
app.use(pinia);
app.mount('#app');
