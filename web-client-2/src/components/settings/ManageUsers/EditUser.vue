<template>
    <b-modal size="lg" id="userEditModal" class="text-secondary" centered hide-footer hide-header-close title="Edit User" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Fill in the fields you want to edit on <b>{{user.display_name}}</b>:</h5>

            <label for="edit-user-name">Username:</label><br/><input id="edit-user-name" v-model="userName" placeholder="Enter a username..."><br/>
            <label for="edit-user-pass">Password:</label><br/><input id="edit-user-pass" type="password" v-model="userPassword" placeholder="Enter a password..."><br/>
            <label for="edit-user-pass2">Repeat Password:</label><br/><input id="edit-user-pass2" type="password" v-model="userPassword2" placeholder="Repeat your password..."><br/>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="errorText != ''" :msg="errorText"/><br>
            <b-button id="userEditModalButton" class="btn btn-secondary" v-b-modal.userEditModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editUser" >Edit</button>
        </div>
	</b-modal>
</template>

<script>
    import { sha512 } from "js-sha512"
    import ErrorText from "../../helpers/ErrorText.vue"
	import LoadingIcon from "../../helpers/LoadingIcon.vue"

	export default {
		name: "EditUser",
		components: {
            ErrorText,
            LoadingIcon
		},
        emits: ["loadUsers"],
		data () {
			return {
                userName: "",
                userPassword: "",
                userPassword2: "",

                user: {},

                errorText: "",
                isLoading: false
			}
		},
        methods: {
            editUserClicked(u) {
                this.user = u
            },
            editUser() {
                var u = {
                    id: this.user.id
                }
                if (this.userPassword != this.userPassword2) {
                    this.errorText = "The two passwords do not match!"
                    return
                }
                if (!this.userName) {
                    this.errorText = "The username can not be empty!"
                    return
                }
                if (this.userPassword && this.userName) {
                    u.login_hash = ("login_hash", sha512("technikag" + this.userName + ":" + this.userPassword))
                    u.display_name = this.userName
                }

                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editUser", {user: u, callback: (_res, err) => {
                    this.isLoading = false
                    if (err) {
                        this.errorText = err
                        return
                    }
                    this.$emit("loadUsers")
                    $('#userEditModalButton').click()
                }})
            },
        }
	}
</script>

<style>
</style>
