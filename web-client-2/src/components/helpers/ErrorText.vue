<template>
	<p class="text-danger h6"> {{ msgShow }}</p>
</template>

<script>
	export default {
		name: "ErrorText",
		props: {
			msg: String | Error
		},
		computed: {
			msgShow: function () {
				if (this.msg.response?.data)
					return this.msg.response.data
				else
					return this.msg
				}
		}
	}
</script>

<style>
</style>