import Vue from 'vue';
// Prototypes
Array.prototype.chunk = function(size) {
    let sets = [],
        a = [...this],
        chunk = a.length / size;
    while (sets.length < chunk) {
        sets[sets.length] = a.splice(0, size);
    }

    return sets;
};

String.prototype.capitalize = function() {
    return this[0].toUpperCase() + this.slice(1);
};

String.prototype.reverse = function() {
    return this.split('').reverse().join('');
};

String.prototype.path = function(obj) {
    return this.split('.').reduce((o, i) => typeof o !== 'object' ? o : o[i], obj);
};

export let asyncComponents = (components,namespace) => components.reduce((components, component) => ({...components,[component]: () => import(`./components/${namespace ? namespace + '/' : ''}${component}.vue`)}), {});
