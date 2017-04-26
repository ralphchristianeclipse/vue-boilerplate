import Components from '../components';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		component: Components.Home,
		name: 'home'
	},
	{
		path: '/*',
		redirect: {name: 'home'}
	},
];

const router = new VueRouter({
	mode: 'history',
	routes
});


export default router;