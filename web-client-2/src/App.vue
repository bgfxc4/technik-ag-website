<template>
	<div id="app-vue">
		<TopBar v-if="$route.name != 'Login'"/>
		<router-view />
	</div>
</template>

<script>
	import TopBar from "./components/TopBar.vue"

	export default {
		name: "app",
		components: {
			TopBar
		},
		data() {
			return {
				showLogin: false,
				showInventory: false,
				showStorage: false,
				showHome: true,
			}
		},
		computed: {
			loggedIn: function () {return this.$store.getters.isAuthenticated()}
		},
		mounted() {
			document.title = "Technik AG"
		}
	}
</script>

<style>
	html {
		margin: 0;
		padding: 0;
	}
</style>
