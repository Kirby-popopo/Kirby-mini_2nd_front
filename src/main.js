//import './assets/main.css'

import { createApp } from 'vue';
import {createBootstrap} from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import axios from './util/axios';
import App from './App.vue';
import SideBar from './components/SideBar.vue';
import router from './router/router';


const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.component('SideBar', SideBar);
app.use(createBootstrap()) // Important
app.use(router);
app.mount('#app');
