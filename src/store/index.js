import Vue from 'vue';
import Vuex from 'vuex';

import router from '../router';

Vue.use(Vuex);

const getters = {};
const mutations = {};
const actions = {};
const state = {};

const store = new Vuex.Store({
	state,
	mutations,
	getters,
	actions
});


export default store;