<template>
	<div id="settings">
		<manage-users />
	</div>
</template>

<script>
	import ManageUsers from "./ManageUsers.vue"

	export default {
		name: "SettingsPanel",
		components: {
			ManageUsers
		},
		data () {
			return {}
		}
	}
</script>

<style>
</style>
