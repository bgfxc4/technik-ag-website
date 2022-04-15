<template>
	<div id="error-text">
		<p class="text-danger h6"> {{ msgShow }}
			<template v-if="msgIs401">
				<br>You may need to <router-link to="/login" class="btn btn-sm btn-danger" >Log In</router-link>
			</template>
		</p>
	</div>
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
			},
			msgIs401: function () {
				if (this.msg.response?.status == 401)
					return true
				else
					return false
			}
		}
	}
</script>

<style>
</style>