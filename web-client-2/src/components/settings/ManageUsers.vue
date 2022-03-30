<template>
	<div id="manageUsers">
        <h4 style="margin-left: 4%">Manage Users:</h4>
        <ul class="list-group" style="width: 80%; margin-left: 10%">
            <li v-for="u in userList" style="margin: 0; position: relative" :key="u.display_name" class="list-group-item">
                <b>Name: </b>{{u.display_name}}
                <button v-if="u.permissions != 1" v-b-modal.deleteUserModal @click="deleteUserName = u.display_name" class="btn btn-danger" style="position: absolute; right: 10px;; top: 3px">
					<font-awesome-icon icon="trash-can"/>
				</button>
                <button v-if="u.permissions != 1" v-b-modal.userPermissionsModal @click="editPermUserClicked(u)" class="btn btn-primary" style="position: absolute; right: 60px;; top: 3px">
					Edit Permissions
				</button>
            </li>
        </ul>
        <button class="btn btn-secondary" style="margin-left: 11%" v-b-modal.createUserModal>Create new user</button>

        <b-modal size="lg" id="createUserModal" class="text-secondary" centered hide-footer hide-header-close title="Create User" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-user-name">Username:</label><br/><input id="create-user-name" v-model="userName" placeholder="Enter a username..."><br/>
				<label for="create-user-pass">Password:</label><br/><input id="create-user-pass" type="password" v-model="userPassword" placeholder="Enter a password..."><br/>
				<label for="create-user-pass2">Repeat Password:</label><br/><input id="create-user-pass2" type="password" v-model="userPassword2" placeholder="Repeat your password..."><br/>
                <error-text v-if="createUserErrorText != ''" :msg="createUserErrorText"/><br>
				<b-button id="createUserModalButton" class="btn btn-secondary" v-b-modal.createUserModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="createUser">Create User</button>
			</div>
		</b-modal>
        <b-modal size="lg" id="deleteUserModal" class="text-secondary" centered hide-footer hide-header-close title="Delete User" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
                Do you really want to delete the user {{deleteUserName}}?
                <error-text v-if="deleteUserErrorText != ''" :msg="deleteUserErrorText"/><br>
				<b-button id="deleteUserModalButton" class="btn btn-secondary" v-b-modal.deleteUserModal>Cancel</b-button>
				<button class="btn btn-outline-danger" @click="deleteUser">Delete User</button>
			</div>
		</b-modal>
        <b-modal size="lg" id="userPermissionsModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Permissions" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <input class="form-check-input" type="checkbox" v-model="permViewInvChecked" id="permViewInv">
                <label class="form-check-label" for="permViewInv">View Inventory</label>

                <input class="form-check-input" type="checkbox" v-model="permEditInvChecked" id="permEditInv">
                <label class="form-check-label" for="permEditInv">Edit Inventory</label><br>

                <input class="form-check-input" type="checkbox" v-model="permViewStorChecked" id="permViewStor">
                <label class="form-check-label" for="permViewStor">View Storage</label>

                <input class="form-check-input" type="checkbox" v-model="permEditStorChecked" id="permEditStor">
                <label class="form-check-label" for="permEditStor">Edit Storage</label><br>

                <input class="form-check-input" type="checkbox" v-model="permViewUsrChecked" id="permViewUsr">
                <label class="form-check-label" for="permViewUsr">View Users</label>

                <input class="form-check-input" type="checkbox" v-model="permEditUsrChecked" id="permEditUsr">
                <label class="form-check-label" for="permEditUsr">Edit Users</label>

                <error-text v-if="permissionsUserErrorText != ''" :msg="permissionsUserErrorText"/><br>
				<b-button id="userPermissionsModalButton" class="btn btn-secondary" v-b-modal.userPermissionsModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="editPermUserConfirmed">Apply</button>
			</div>
		</b-modal>
	</div>
</template>

<script>
    import { sha512 } from "js-sha512"
    import ErrorText from "../helpers/ErrorText.vue"

	export default {
		name: "ManageUsers",
		components: {
            ErrorText
		},
		data () {
			return {
                userList: [],

                userName: "",
                userPassword: "",
                userPassword2: "",

                permViewInvChecked: false,
                permEditInvChecked: false,
                permViewStorChecked: false,
                permEditStorChecked: false,
                permViewUsrChecked: false,
                permEditUsrChecked: false,

                permissionsUserErrorText: "",
                createUserErrorText: "",
                deleteUserErrorText: "",

                editPermUser: {},
                deleteUserName: ""
			}
		},
        methods: {
            createUser () {
                this.createUserErrorText = ""
                if (this.userPassword != this.userPassword2) {
                    this.createUserErrorText = "The passwords do not match."
                    return
                }
                if (this.userName == "" || this.userPassword == "" || this.userDisplayName == "") {
                    this.createUserErrorText = "Every field has to be filled!"
                    return
                }
                var user = {
                    display_name: this.userName,
                    login_hash: ("login_hash", sha512("technikag" + this.userName + ":" + this.userPassword))
                }
                this.$store.dispatch("createUser", {user, callback: (res, err) => {
                    if (err) {
                        this.createUserErrorText = err
                        return
                    }
                    $('#createUserModalButton').click()
                    this.createUserErrorText = ""
                    this.userName = ""
                    this.userPassword = ""
                    this.userPassword2 = ""
                    this.loadUsers()
                }})
            },
            deleteUser () {
                this.deleteUserErrorText = ""
                this.$store.dispatch("deleteUser", { user: {display_name: this.deleteUserName}, callback: (res, err) => {
                    if (err) {
                        this.deleteUserErrorText = err
                        return
                    }
                    $('#deleteUserModalButton').click()
                    this.deleteUserErrorText = ""
                    this.loadUsers()
                }})
            },
            editPermUserClicked (u) {
                this.editPermUser = u
                this.permViewInvChecked = (this.editPermUser.permissions & (1 << 1)) != 0
                this.permEditInvChecked = (this.editPermUser.permissions & (1 << 2)) != 0
                this.permViewStorChecked = (this.editPermUser.permissions & (1 << 3)) != 0
                this.permEditStorChecked = (this.editPermUser.permissions & (1 << 4)) != 0
                this.permViewUsrChecked = (this.editPermUser.permissions & (1 << 5)) != 0
                this.permEditUsrChecked = (this.editPermUser.permissions & (1 << 6)) != 0
            },
            editPermUserConfirmed () {
                this.permissionsUserErrorText = ""
                var permissions = 0;
                if (this.permViewInvChecked) permissions += (1 << 1)
                if (this.permEditInvChecked) permissions += (1 << 2)
                if (this.permViewStorChecked) permissions += (1 << 3)
                if (this.permEditStorChecked) permissions += (1 << 4)
                if (this.permViewUsrChecked) permissions += (1 << 5)
                if (this.permEditUsrChecked) permissions += (1 << 6)
                var user = {
                    display_name: this.editPermUser.display_name,
                    permissions
                }
                this.$store.dispatch("editPermUser", {user, callback: (res, err) => {
                    if (err) {
                        this.permissionsUserErrorText = err
                        return
                    }
                    $('#userPermissionsModalButton').click()
                    this.loadUsers()
                }})
            },
            loadUsers () {
                this.$store.dispatch("getUsers", (res, err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    this.userList = res.data
                })
            }
        },
        created () {
            this.loadUsers()
        }
	}
</script>

<style>
</style>
