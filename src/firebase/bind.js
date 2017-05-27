export default class VuexFirebase {
	constructor(ref, {
		hooks = {},
		limit = 1000,
		data = []
	} = {}) {
		this.data = data;
		this.events = {};
		this.limit = limit;
		this.ref = ref;
		this.hooks = hooks;
		this.root = this.bind(this.source);
	}

	get source() {
		return VuexFirebase.firebase.getters.$database().ref(this.ref);
	}
	static get firebase() {
		return this._firebase;
	}
	static set firebase(val) {
		this._firebase = val;
	}
	static get commit() {
		return this._commit;
	}

	static set commit(value) {
		return this._commit = value;
	}

	index(key) {
		return this.data.findIndex(val => val._.key === key);
	}

	record(snap) {
		let data = {
			_: {
				key: snap.key,
				ref: this.ref
			}
		};
		if (typeof snap.val() === 'object') {
			data = {
				...data,
				...snap.val()
			};
		} else {
			data = {
				...data,
				[data._.key]: snap.val()
			};
		}
		return data;
	}

	bind(source) {
		source.off();
		return {
			source,
			events: ['added', 'changed', 'removed', 'moved'].reduce(async (events, event) => (await {
				...events,
				[event]: source.on(`child_${event}`, async (snap, prev) => {
					if (event === 'added' && this.index(snap.key) !== -1) {
						console.log(event, 'duplicate', snap.key);
						return;
					}
					let prevIndex = await prev ? this.index(prev) + 1 : 0,
						index = await this.index(snap.key),
						record = await this.record(snap),
						data = {
							index: event === 'added' ? prevIndex : index,
							record
						};

					if (event === 'moved') {
						if (index < prevIndex) --prevIndex;
						data.newIndex = prevIndex;
					}

					//Event Hook
					if (this.hooks[event]) {
						this.hooks[event](data);
					}

					// Store Record in Mutation
					await VuexFirebase.commit(`firebase/${event.toUpperCase()}`, await data);
				}, error => {
					if (this.hooks.error) {
						this.hooks.error(error, this.ref);
					}
				})
			}), {})

		};
	}
};