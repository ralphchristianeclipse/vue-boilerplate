import Vue from 'vue';
import App from './App.vue';
import {asyncComponents} from '../utils';
let registerComponents = (components,namespace = '') => Object.keys(components).forEach(component => Vue.component(`${namespace}${component}`.split(/(?=[A-Z])/).join("-").toLowerCase(), components[component]));

let components = {
    App,
    ...asyncComponents([
        'Home',
    ]),
};
export default components;
