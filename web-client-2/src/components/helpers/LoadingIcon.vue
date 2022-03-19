<template>
	<font-awesome-icon icon="spinner" class="fa-spin" :size="size"/>
</template>

<script>
	export default {
		name: "LoadingIcon",
		props: {
			size: String
		}
	}
</script>

<style>
</style>