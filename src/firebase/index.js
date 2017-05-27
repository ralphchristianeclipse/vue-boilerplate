import VuexFirebase from './bind';

export default function (store, firebase) {
    const Vue = store._watcherVM || store._vm;
    VuexFirebase.commit = store.commit;

    const state = {
        binds: {},
    };
    const mutations = {

        BINDED: (state, payload) => {
            if (state.binds[payload.ref]) return state.binds[payload.ref];
            Vue.$set(state.binds, payload.ref, payload.data);
	        return state.binds[payload.ref];
        },
        UNBINDED: (state, payload) => Vue.$delete(state.binds, payload.ref),
        ADDED: (state, {index, record}) => state.binds[record._.ref].splice(index, 0, record),
        CHANGED: (state, {index, record}) => state.binds[record._.ref].splice(index, 1, record),
        REMOVED: (state, {index, record}) => state.binds[record._.ref].splice(index, 1),
        MOVED: (state, {index, record, newIndex}) => state.binds[record._.ref].splice(newIndex, 0, state.binds[record._.ref].splice(index, 1)[0]),
    };

    const getters = {
        $binds: state => (ref, options) => state.binds[ref] || store.commit('firebase/BINDED', new VuexFirebase(ref, options)) || [],
        //Firebase timestamp
        $timestamp: state => firebase.database.ServerValue.TIMESTAMP,
	    $auth: state => firebase.auth(),
	    $database: state => firebase.database(),
	    $storage: state => firebase.storage(),
	    $key: (state,getters) => ref => getters.$database.ref(ref).push().key
    };

    const actions = {
        /*
         _.ref = the target node ex. 'users'
         _.key = the key for the data to send or you can omit it to use the push key
         _.hook = used for chaining key actions based on the key value good for updating relations of nodes
         _.time = set to true if you want to have created and updated time stamps
         */
        async SAVE({getters}, {_,$, ...data}) {
            let {key, ref, hooks = {error: e => console.log(e)}, time} = _ || data;
            key = key || getters.$key(ref);
            let reference = getters.$database.ref(ref).child(key);
            if (time) {
                data.created = data.created || getters.$timestamp;
                data.updated = getters.$timestamp;
            }
            try {
                let result = await !_ ? reference.remove() : $ !== undefined ? reference.set($) : reference.update(data);
                if (!hooks.success) return;

	            hooks.success(key);
            } catch (e) {
                if(!hooks.error) return;
	            hooks.error(e, data);
            }

        },
    };
	let fb = {
		namespaced: true,
		state,
		getters,
		mutations,
		actions
	};
    store.registerModule('firebase', fb);
	VuexFirebase.firebase = fb;
}