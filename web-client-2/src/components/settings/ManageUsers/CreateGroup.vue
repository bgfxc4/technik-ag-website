<template>
    <b-modal size="lg" id="createGroupModal" class="text-secondary" centered hide-footer hide-header-close title="Create Group" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="create-user-name">Group name:</label><br/><input id="create-group-name" v-model="groupName" placeholder="Enter a group name..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="errorText != ''" :msg="errorText"/><br>
            <b-button id="createGroupModalButton" class="btn btn-secondary" v-b-modal.createGroupModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="createGroup">Create Group</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
	import LoadingIcon from "../../helpers/LoadingIcon.vue"

	export default {
		name: "CreateGroup",
		components: {
            ErrorText,
            LoadingIcon
		},
        emits: ["loadUsers"],
		data () {
			return {
                groupName: "",

                errorText: "",
                isLoading: false
			}
		},
        methods: {
            createGroup () {
                this.errorText = ""
                if (this.groupName == "") {
                    this.errorText = "Every field has to be filled!"
                    return
                }
                var group = {
                    name: this.groupName,
                }
                this.$store.dispatch("createGroup", group).then(_res => {
                    $('#createGroupModalButton').click()
                    this.groupName = ""
                    this.errorText = ""
                    this.$emit("loadUsers")
                }).catch(err => {
                    this.errorText = err
                })
            },
        }
	}
</script>

<style>
</style>
