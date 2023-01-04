<template>
	<div id="manageUsers">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>

        <h4 style="margin-left: 4%">Manage Users:</h4>
        <button class="btn btn-secondary my-2" style="margin-left: 10%" v-b-modal.createUserModal>Create new user</button>
        <button class="btn btn-secondary my-2" style="margin-left: 1%" v-b-modal.createGroupModal>Create new user group</button>

        <div class="card" v-for="g in usersSorted" :key="g.id" style="width: 80%; margin-left: 10%">
            <div class="card-header" :id="`heading${g.id}`">
                <h5 class="mb-0">
                    <a class="btn text-black btn-link" data-bs-toggle="collapse" :data-bs-target="`#collapse${g.id}`" aria-expanded="false" aria-controls="collapseOne">
                        {{g.name}}
                    </a>
                    <template v-if="g.permissions != 1">
                        <a :id="`trigger-menu-popover-${g.id}`" class="text-dark" tabindex="0" style="position: absolute; right: 10px; top: 25px; transform: translateY(-50%)">
                            <font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
                        </a>
                        <b-popover :target="`trigger-menu-popover-${g.id}`" triggers="focus">
                            <button v-b-modal.deleteGroupModal @click="deleteGroupObject = g" class="btn btn-danger">
                                Delete Group
                            </button><br>
                            <button v-b-modal.userPermissionsModal @click="$refs.permModal.editPermGroupClicked(g)" class="btn btn-primary">
                                Edit Permissions
                            </button><br>
                            <button v-b-modal.groupEditModal @click="$refs.editModal.editGroupClicked(g)" class="btn btn-primary">
                                Edit Group
                            </button>
                        </b-popover>
                    </template>
                </h5>
            </div>

            <div :id="`collapse${g.id}`" class="collapse" :aria-labelledby="`heading${g.name}`">
                <div class="card-body">
                    <ul class="list-group">
                        <li v-for="u in g.users" style="margin: 0; position: relative" :key="u.display_name" class="list-group-item">
                            <b>Name: </b>{{u.display_name}}
                            <template v-if="u.id != 0">
                                <a :id="`trigger-menu-popover-${u.id}`" class="text-dark" tabindex="0" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%)">
                                    <font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
                                </a>
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
                            </template>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <create-users :groups="groupList" @loadUsers="loadUsers" />
        <create-group @loadUsers="loadUsers" />
        <b-modal size="lg" id="deleteUserModal" class="text-secondary" centered hide-footer hide-header-close title="Delete User" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
                Do you really want to delete the user {{deleteUserObject.name}}?
                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="deleteUserErrorText != ''" :msg="deleteUserErrorText"/><br>
				<b-button id="deleteUserModalButton" class="btn btn-secondary" v-b-modal.deleteUserModal>Cancel</b-button>
				<button class="btn btn-outline-danger" @click="deleteUser">Delete User</button>
			</div>
		</b-modal>
        <b-modal size="lg" id="deleteGroupModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Group" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
                Do you really want to delete the group {{deleteGroupObject.name}} with all of its users?
                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="deleteGroupErrorText != ''" :msg="deleteGroupErrorText"/><br>
				<b-button id="deleteGroupModalButton" class="btn btn-secondary" v-b-modal.deleteGroupModal>Cancel</b-button>
				<button class="btn btn-outline-danger" @click="deleteGroup">Delete Group</button>
			</div>
		</b-modal>
        <edit-perm-user @loadUsers="loadUsers" ref="permModal"/>
        <edit-user :groups="groupList" @loadUsers="loadUsers" ref="editModal"/>
	</div>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
	import LoadingIcon from "../../helpers/LoadingIcon.vue"
    import CreateUsers from "./CreateUsers.vue"
    import CreateGroup from "./CreateGroup.vue"
    import EditPermUser from "./EditPermUser.vue"
    import EditUser from "./EditUser.vue"

	export default {
		name: "ManageUsers",
		components: {
            ErrorText,
            LoadingIcon,
            CreateUsers,
            EditPermUser,
            EditUser,
            CreateGroup
		},
		data () {
			return {
                userList: [],
                groupList: [],
                usersSorted: [],

                isLoading: false,
                errorText: "",
                deleteUserErrorText: "",
                deleteGroupErrorText: "",

                deleteUserObject: {},
                deleteGroupObject: {}
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
            deleteGroup () {
                this.deleteGroupErrorText = ""
                this.$store.dispatch("deleteGroup", {id: this.deleteGroupObject.id}).then(_res => {
                    $('#deleteGroupModalButton').click()
                    this.loadUsers()
                }).catch(err => {
                    this.deleteGroupErrorText = err
                })
            },
            loadUsers () {
                this.loadGroups()
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getUsers").then(res => {
                    this.isLoading = false
                    this.userList = res.data

                    this.usersSorted = this.groupList.map(el => {el.users = this.userList.filter(u => u.group_id == el.id); return el})
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
            loadGroups () {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getGroups").then(res => {
                    this.isLoading = false
                    this.groupList = res.data
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
