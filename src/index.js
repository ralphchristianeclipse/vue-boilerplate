import 'babel-polyfill';
import Vue from 'vue';

import { mapGetters, mapActions } from 'vuex';
import router from './router';
import store from './store';
import Components from './components';
import './assets';
import './utils';


const app = new Vue({
    el: '#app',
    store,
    router,
    render: h => h(Components.App)
});