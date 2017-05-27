<template lang="pug">
	keep-alive
		router-view
</template>

<script>
	import {mapGetters, mapActions} from 'vuex';
	export default {
		name: "app",
	}
</script>

<style lang="stylus">

	@import './app.styl';

</style>
