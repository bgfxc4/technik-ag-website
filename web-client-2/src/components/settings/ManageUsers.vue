<template>
	<div id="manageUsers">
        <ul class="list-group">
            <li v-for="u in userList" :key="u.name" class="list-group-item">{{u.name}} {{u.permissions}}</li>
        </ul>
	</div>
</template>

<script>
	export default {
		name: "ManageUsers",
		components: {
		},
		data () {
			return {
                userList: []
			}
		},
        created () {
            this.$store.dispatch("getUsers", (res, err) => {
                if (err) {
                    console.log(err)
                    return
                }
                this.userList = res.data
            })
        }
	}
</script>

<style>
</style>
