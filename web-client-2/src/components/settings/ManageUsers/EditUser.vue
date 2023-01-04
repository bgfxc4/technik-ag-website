<template>
    <b-modal size="lg" id="userEditModal" class="text-secondary" centered hide-footer hide-header-close title="Edit User" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Fill in the fields you want to edit on <b>{{user.display_name}}</b>:</h5>

            <label for="edit-user-name">Username:</label><br/><input id="edit-user-name" v-model="userName" placeholder="Enter a username..."><br/>
            <label for="edit-user-pass">Password:</label><br/><input id="edit-user-pass" type="password" v-model="userPassword" placeholder="Enter a password..."><br/>
            <label for="edit-user-pass2">Repeat Password:</label><br/><input id="edit-user-pass2" type="password" v-model="userPassword2" placeholder="Repeat your password..."><br/>

            <select v-model="userGroup" class="form-select my-3 bg-white" style="width: auto; margin-left: 50%; transform: translateX(-50%); text-align: center; color: black" aria-label="Select user group">
                <option selected value="">Select the group for the user</option>
                <template v-for="g in groups">
                    <option v-if="g.id != 'G00000000-0000-0000-0000-000000000000'" :key="g.id" :value="g.id" style="color: black">{{g.name}}</option>
                </template>
            </select>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="errorText != ''" :msg="errorText"/><br>
            <b-button id="userEditModalButton" class="btn btn-secondary" v-b-modal.userEditModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editUser" >Edit</button>
        </div>
	</b-modal>

    <b-modal size="lg" id="groupEditModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Group" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Fill in the fields you want to edit on the group <b>{{group.name}}</b>:</h5>

            <label for="edit-group-name">Name:</label><br/><input id="edit-group-name" v-model="groupName" placeholder="Enter a name..."><br/>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="errorText != ''" :msg="errorText"/><br>
            <b-button id="groupEditModalButton" class="btn btn-secondary" v-b-modal.groupEditModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editGroup" >Edit</button>
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
        props: {
            groups: Array
        },
        emits: ["loadUsers"],
		data () {
			return {
                userName: "",
                userPassword: "",
                userPassword2: "",
                userGroup: "",
                user: {},

                groupName: "",
                group:  {},


                errorText: "",
                isLoading: false
			}
		},
        methods: {
            editUserClicked(u) {
                this.user = u
            },
            editGroupClicked(g) {
                this.group = g
            },
            editUser() {
                var u = {
                    id: this.user.id
                }
                if (this.userPassword != this.userPassword2) {
                    this.errorText = "The two passwords do not match!"
                    return
                }
                if (this.userPassword && this.userName) {
                    u.login_hash = ("login_hash", sha512("technikag" + this.userName + ":" + this.userPassword))
                    u.display_name = this.userName
                }

                if (this.userGroup) {
                    u.group_id = this.userGroup
                }

                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editUser", u).then(_res => {
                    this.isLoading = false
                    this.$emit("loadUsers")
                    $('#userEditModalButton').click()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
            editGroup() {
                var g = {
                    id: this.group.id
                }
                if (this.groupName) {
                    g.name = this.groupName
                }

                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editGroup", g).then(_res => {
                    this.isLoading = false
                    this.$emit("loadUsers")
                    $('#groupEditModalButton').click()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
        }
	}
</script>

<style>
</style>
