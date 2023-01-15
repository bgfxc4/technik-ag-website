<template>
    <b-modal size="lg" id="userPermissionsModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Permissions" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <div class="card" v-for="p in Object.keys(perms)" :key="p">
                <div class="card-header" :id="`heading${p}`">
                    <h5 class="mb-0">
                        <a class="btn btn-link text-black" data-bs-toggle="collapse" :data-bs-target="`#collapse${p}`" aria-expanded="false" aria-controls="collapseOne">
                            {{p}}
                        </a>
                    </h5>
                </div>

                <div :id="`collapse${p}`" class="collapse" :aria-labelledby="`heading${p}`">
                    <div class="card-body">
                        <template v-for="i in Object.keys(perms[p])" :key="i">
                            <input class="form-check-input" type="checkbox" v-model="perms[p][i].checked" :id="`perm-${p}-${i}`">
                            <label class="form-check-label" :for="`perm-${p}-${i}`">{{perms[p][i].desc}}</label><br>
                        </template>
                    </div>
                </div>
            </div>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="errorText != ''" :msg="errorText"/><br>
            <b-button id="userPermissionsModalButton" class="btn btn-secondary" v-b-modal.userPermissionsModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editPermUser">Apply</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
	import LoadingIcon from "../../helpers/LoadingIcon.vue"

	export default {
		name: "EditPermUser",
		components: {
            ErrorText,
            LoadingIcon
		},
        emits: ["loadUsers"],
		data () {
			return {
                perms: {
                    Inventory: {
                        ViewInv: {
                            checked: false,
                            shift: 1,
                            desc: "View Inventory"
                        },
                        EditInv: {
                            checked: false,
                            shift: 2,
                            desc: "Edit Inventory"
                        }
                    },
                    Storage: {
                        ViewStor: {
                            checked: false,
                            shift: 3,
                            desc: "View Storage"
                        },
                        EditStor: {
                            checked: false,
                            shift: 4,
                            desc: "Edit Storage"
                        }
                    },
                    Users: {
                        ViewUsr: {
                            checked: false,
                            shift: 5,
                            desc: "View Users"
                        },
                        EditUsr: {
                            checked: false,
                            shift: 6,
                            desc: "Edit Users"
                        }
                    },
                    Appointments: {
                        RequestAppmnts: {
                            checked: false,
                            shift: 7,
                            desc: "Request Appointments"
                        },
                        ViewAppmnts: {
                            checked: false,
                            shift: 8,
                            desc: "View Appointments"
                        },
                        EditAppmnts: {
                            checked: false,
                            shift: 9,
                            desc: "Edit Appointments"
                        }
                    },
                    Tools: {
                        RequestAppmnts: {
                            checked: false,
                            shift: 10,
                            desc: "View Checklists"
                        },
                        ViewAppmnts: {
                            checked: false,
                            shift: 11,
                            desc: "Edit Checklists"
                        }
                    },
                },

                errorText: "",
                isLoading: false,
                user: {},
                group: {}
			}
		},
        methods: {
            editPermUserClicked (u) {
                this.group = {}
                this.user = u
                for (var i of Object.keys(this.perms)) {
                    for (var j of Object.keys(this.perms[i])) {
                        this.perms[i][j].checked = (this.user.permissions & (1 << this.perms[i][j].shift)) != 0
                    }
                }
            },
            editPermGroupClicked (g) {
                this.user = {}
                this.group = g
                for (var i of Object.keys(this.perms)) {
                    for (var j of Object.keys(this.perms[i])) {
                        this.perms[i][j].checked = (this.group.permissions & (1 << this.perms[i][j].shift)) != 0
                    }
                }
            },
            editPermUser () {
                this.errorText = ""
                var permissions = 0;
                for (var i of Object.keys(this.perms)) {
                    for (var j of Object.keys(this.perms[i])) {
                        if (this.perms[i][j].checked)
                            permissions += (1 << this.perms[i][j].shift)
                    }
                }

                var user = {
                    id: Object.keys(this.group).length == 0 ? this.user.id : this.group.id,
                    permissions
                }
                this.isLoading = true
                this.$store.dispatch((Object.keys(this.group).length == 0 ? "editPermUser" : "editGroup"), user).then(_res => {
                    this.isLoading = false
                    $('#userPermissionsModalButton').click()
                    this.$emit("loadUsers")
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
