<template>
    <b-modal size="lg" id="createUserModal" class="text-secondary" centered hide-footer hide-header-close title="Create User" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="create-user-name">Username:</label><br/><input id="create-user-name" v-model="userName" placeholder="Enter a username..."><br/>
            <label for="create-user-pass">Password:</label><br/><input id="create-user-pass" type="password" v-model="userPassword" placeholder="Enter a password..."><br/>
            <label for="create-user-pass2">Repeat Password:</label><br/><input id="create-user-pass2" type="password" v-model="userPassword2" placeholder="Repeat your password..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="errorText != ''" :msg="errorText"/><br>
            <b-button id="createUserModalButton" class="btn btn-secondary" v-b-modal.createUserModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="createUser">Create User</button>
        </div>
    </b-modal>
</template>

<script>
    import { sha512 } from "js-sha512"
    import ErrorText from "../../helpers/ErrorText.vue"
	import LoadingIcon from "../../helpers/LoadingIcon.vue"

	export default {
		name: "CreateUser",
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

                errorText: "",
                isLoading: false
			}
		},
        methods: {
            createUser () {
                this.errorText = ""
                if (this.userPassword != this.userPassword2) {
                    this.errorText = "The passwords do not match."
                    return
                }
                if (this.userName == "" || this.userPassword == "" || this.userDisplayName == "") {
                    this.userPassword = "Every field has to be filled!"
                    return
                }
                var user = {
                    display_name: this.userName,
                    login_hash: ("login_hash", sha512("technikag" + this.userName + ":" + this.userPassword))
                }
                this.$store.dispatch("createUser", {user, callback: (_res, err) => {
                    if (err) {
                        this.errorText = err
                        return
                    }
                    $('#createUserModalButton').click()
                    this.userPassword = ""
                    this.userName = ""
                    this.userPassword = ""
                    this.userPassword2 = ""
                    this.$emit("loadUsers")
                }})
            },
        }
	}
</script>

<style>
</style>
