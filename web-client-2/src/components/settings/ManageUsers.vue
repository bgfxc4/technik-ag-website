<template>
	<div id="manageUsers">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>

        <h4 style="margin-left: 4%">Manage Users:</h4>
        <ul class="list-group" style="width: 80%; margin-left: 10%">
            <li v-for="u in userList" style="margin: 0; position: relative" :key="u.display_name" class="list-group-item">
                <b>Name: </b>{{u.display_name}}
                <button v-if="u.permissions != 1" :id="`trigger-menu-popover-${u.id}`" class="btn btn-dark" href="#" tabindex="0" style="position: absolute; right: 10px; top: 3px">
                    <font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
                </button>
                <b-popover :target="`trigger-menu-popover-${u.id}`" triggers="focus">
                    <button v-b-modal.deleteUserModal @click="deleteUserObject = u" class="btn btn-danger">
                        Delete User
                    </button><br>
                    <button v-b-modal.userPermissionsModal @click="editPermUserClicked(u)" class="btn btn-primary">
                        Edit Permissions
                    </button><br>
                    <button v-b-modal.userEditModal @click="editUserObject = u" class="btn btn-primary">
                        Edit User
                    </button>
                </b-popover>
            </li>
        </ul>
        <button class="btn btn-secondary" style="margin-left: 11%" v-b-modal.createUserModal>Create new user</button>

        <b-modal size="lg" id="createUserModal" class="text-secondary" centered hide-footer hide-header-close title="Create User" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-user-name">Username:</label><br/><input id="create-user-name" v-model="userName" placeholder="Enter a username..."><br/>
				<label for="create-user-pass">Password:</label><br/><input id="create-user-pass" type="password" v-model="userPassword" placeholder="Enter a password..."><br/>
				<label for="create-user-pass2">Repeat Password:</label><br/><input id="create-user-pass2" type="password" v-model="userPassword2" placeholder="Repeat your password..."><br/>
		        <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="createUserErrorText != ''" :msg="createUserErrorText"/><br>
				<b-button id="createUserModalButton" class="btn btn-secondary" v-b-modal.createUserModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="createUser">Create User</button>
			</div>
		</b-modal>
        <b-modal size="lg" id="deleteUserModal" class="text-secondary" centered hide-footer hide-header-close title="Delete User" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
                Do you really want to delete the user {{deleteUserObject.name}}?
                <loading-icon v-if="isLoading" size="3x"/>
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

                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="permissionsUserErrorText != ''" :msg="permissionsUserErrorText"/><br>
				<b-button id="userPermissionsModalButton" class="btn btn-secondary" v-b-modal.userPermissionsModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="editPermUser">Apply</button>
			</div>
		</b-modal>
        <b-modal size="lg" id="userEditModal" class="text-secondary" centered hide-footer hide-header-close title="Edit User" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <h5>Fill in the fields you want to edit on <b>{{editUserObject.display_name}}</b>:</h5>

				<label for="edit-user-name">Username:</label><br/><input id="edit-user-name" v-model="editUserName" placeholder="Enter a username..."><br/>
				<label for="edit-user-pass">Password:</label><br/><input id="edit-user-pass" type="password" v-model="editUserPassword" placeholder="Enter a password..."><br/>
				<label for="edit-user-pass2">Repeat Password:</label><br/><input id="edit-user-pass2" type="password" v-model="editUserPassword2" placeholder="Repeat your password..."><br/>

                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="editUserErrorText != ''" :msg="editUserErrorText"/><br>
				<b-button id="userEditModalButton" class="btn btn-secondary" v-b-modal.userEditModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="editUser" >Edit</button>
			</div>
		</b-modal>
	</div>
</template>

<script>
    import { sha512 } from "js-sha512"
    import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"

	export default {
		name: "ManageUsers",
		components: {
            ErrorText,
            LoadingIcon
		},
		data () {
			return {
                userList: [],

                userName: "",
                userPassword: "",
                userPassword2: "",

                editUserObject: {},
                editUserName: "",
                editUserPassword: "",
                editUserPassword2: "",

                permViewInvChecked: false,
                permEditInvChecked: false,
                permViewStorChecked: false,
                permEditStorChecked: false,
                permViewUsrChecked: false,
                permEditUsrChecked: false,

                isLoading: false,
                errorText: "",
                permissionsUserErrorText: "",
                createUserErrorText: "",
                deleteUserErrorText: "",
                editUserErrorText: "",

                editPermUserObject: {},
                deleteUserObject: {}
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
                this.$store.dispatch("createUser", {user, callback: (_res, err) => {
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
                this.$store.dispatch("deleteUser", { user: {id: this.deleteUserObject.id}, callback: (_res, err) => {
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
                this.editPermUserObject = u
                this.permViewInvChecked = (this.editPermUserObject.permissions & (1 << 1)) != 0
                this.permEditInvChecked = (this.editPermUserObject.permissions & (1 << 2)) != 0
                this.permViewStorChecked = (this.editPermUserObject.permissions & (1 << 3)) != 0
                this.permEditStorChecked = (this.editPermUserObject.permissions & (1 << 4)) != 0
                this.permViewUsrChecked = (this.editPermUserObject.permissions & (1 << 5)) != 0
                this.permEditUsrChecked = (this.editPermUserObject.permissions & (1 << 6)) != 0
            },
            editPermUser () {
                this.permissionsUserErrorText = ""
                var permissions = 0;
                if (this.permViewInvChecked) permissions += (1 << 1)
                if (this.permEditInvChecked) permissions += (1 << 2)
                if (this.permViewStorChecked) permissions += (1 << 3)
                if (this.permEditStorChecked) permissions += (1 << 4)
                if (this.permViewUsrChecked) permissions += (1 << 5)
                if (this.permEditUsrChecked) permissions += (1 << 6)
                var user = {
                    id: this.editPermUserObject.id,
                    permissions
                }
                this.$store.dispatch("editPermUser", {user, callback: (_res, err) => {
                    if (err) {
                        this.permissionsUserErrorText = err
                        return
                    }
                    $('#userPermissionsModalButton').click()
                    this.loadUsers()
                }})
            },
            editUser() {
                var user = {
                    id: this.editUserObject.id
                }
                if (this.editUserPassword != this.editUserPassword2) {
                    this.editUserErrorText = "The two passwords do not match!"
                    return
                }
                if (!this.editUserName) {
                    this.editUserErrorText = "The username can not be empty!"
                    return
                }
                if (this.editUserPassword && this.editUserName) {
                    user.login_hash = ("login_hash", sha512("technikag" + this.editUserName + ":" + this.editUserPassword))
                    user.display_name = this.editUserName
                }

                this.isLoading = true
                this.editUserErrorText = ""
                this.$store.dispatch("editUser", {user, callback: (_res, err) => {
                    this.isLoading = false
                    if (err) {
                        this.editUserErrorText = err
                        return
                    }
                    this.loadUsers()
                    $('#userEditModalButton').click()
                }})
            },
            loadUsers () {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getUsers", (res, err) => {
                    this.isLoading = false
                    if (err) {
                        this.errorText = err
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
