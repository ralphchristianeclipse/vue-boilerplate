import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import router from './router';
import store from './store';
import Components from './components';
import './assets';
import './utils';

Vue.use(Vuetify);

const app = new Vue({
    el: '#app',
    store,
    router,
    render: h => h(Components.App)
});