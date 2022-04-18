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
                    <button v-b-modal.userPermissionsModal @click="$refs.permModal.editPermUserClicked(u)" class="btn btn-primary">
                        Edit Permissions
                    </button><br>
                    <button v-b-modal.userEditModal @click="$refs.editModal.editUserClicked(u)" class="btn btn-primary">
                        Edit User
                    </button>
                </b-popover>
            </li>
        </ul>
        <button class="btn btn-secondary" style="margin-left: 11%" v-b-modal.createUserModal>Create new user</button>

        <create-users @loadUsers="loadUsers" />
        <b-modal size="lg" id="deleteUserModal" class="text-secondary" centered hide-footer hide-header-close title="Delete User" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
                Do you really want to delete the user {{deleteUserObject.name}}?
                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="deleteUserErrorText != ''" :msg="deleteUserErrorText"/><br>
				<b-button id="deleteUserModalButton" class="btn btn-secondary" v-b-modal.deleteUserModal>Cancel</b-button>
				<button class="btn btn-outline-danger" @click="deleteUser">Delete User</button>
			</div>
		</b-modal>
        <edit-perm-user @loadUsers="loadUsers" ref="permModal"/>
        <edit-user @loadUsers="loadUsers" ref="editModal"/>
	</div>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
	import LoadingIcon from "../../helpers/LoadingIcon.vue"
    import CreateUsers from "./CreateUsers.vue"
    import EditPermUser from "./EditPermUser.vue"
    import EditUser from "./EditUser.vue"

	export default {
		name: "ManageUsers",
		components: {
            ErrorText,
            LoadingIcon,
            CreateUsers,
            EditPermUser,
            EditUser
		},
		data () {
			return {
                userList: [],

                isLoading: false,
                errorText: "",
                deleteUserErrorText: "",

                deleteUserObject: {}
			}
		},
        methods: {
            deleteUser () {
                this.deleteUserErrorText = ""
                this.$store.dispatch("deleteUser", {id: this.deleteUserObject.id}).then(_res => {
                    $('#deleteUserModalButton').click()
                    this.loadUsers()
                }).catch(err => {
                    this.deleteUserErrorText = err
                })
            },
            loadUsers () {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getUsers").then(res => {
                    this.isLoading = false
                    this.userList = res.data
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
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
