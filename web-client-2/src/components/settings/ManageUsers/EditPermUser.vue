<template>
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

            <input class="form-check-input" type="checkbox" v-model="permRequestAppmntsChecked" id="permRequestAppmnt">
            <label class="form-check-label" for="permRequestAppmnt">Request Appointments</label>
            <input class="form-check-input" type="checkbox" v-model="permViewAppmntChecked" id="permViewAppmnt">
            <label class="form-check-label" for="permViewAppmnt">View Appointments </label>
            <input class="form-check-input" type="checkbox" v-model="permEditAppmntsChecked" id="permEditAppmnt">
            <label class="form-check-label" for="permEditAppmnt">Edit Appointments</label>

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
                permViewInvChecked: false,
                permEditInvChecked: false,

                permViewStorChecked: false,
                permEditStorChecked: false,

                permViewUsrChecked: false,
                permEditUsrChecked: false,

                permRequestAppmntsChecked: false,
                permViewAppmntChecked: false,
                permEditAppmntsChecked: false,

                errorText: "",
                isLoading: false,
                user: {}
			}
		},
        methods: {
            editPermUserClicked (u) {
                this.user = u
                this.permViewInvChecked = (this.user.permissions & (1 << 1)) != 0
                this.permEditInvChecked = (this.user.permissions & (1 << 2)) != 0

                this.permViewStorChecked = (this.user.permissions & (1 << 3)) != 0
                this.permEditStorChecked = (this.user.permissions & (1 << 4)) != 0

                this.permViewUsrChecked = (this.user.permissions & (1 << 5)) != 0
                this.permEditUsrChecked = (this.user.permissions & (1 << 6)) != 0

                this.permRequestAppmntsChecked = (this.user.permissions & (1 << 7)) != 0
                this.permViewAppmntChecked = (this.user.permissions & (1 << 8)) != 0
                this.permEditAppmntsChecked = (this.user.permissions & (1 << 9)) != 0
            },
            editPermUser () {
                this.errorText = ""
                var permissions = 0;
                if (this.permViewInvChecked) permissions += (1 << 1)
                if (this.permEditInvChecked) permissions += (1 << 2)

                if (this.permViewStorChecked) permissions += (1 << 3)
                if (this.permEditStorChecked) permissions += (1 << 4)

                if (this.permViewUsrChecked) permissions += (1 << 5)
                if (this.permEditUsrChecked) permissions += (1 << 6)

                if (this.permRequestAppmntsChecked) permissions += (1 << 7)
                if (this.permViewAppmntChecked) permissions += (1 << 8)
                if (this.permEditAppmntsChecked) permissions += (1 << 9)
                var user = {
                    id: this.user.id,
                    permissions
                }
                this.isLoading = true
                this.$store.dispatch("editPermUser", user).then(_res => {
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
