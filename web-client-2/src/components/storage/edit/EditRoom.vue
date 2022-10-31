<template>
    <b-modal size="lg" id="editRoomModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Room" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            Enter a new name for the room <b>{{room}}</b>:<br>
            <label for="edit-room-name">Name:</label><br/><input id="edit-room-name" v-model="name" placeholder="Enter a name..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editRoomModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editRoom">Edit Room</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "EditRoom",
        emits: ['onEdit', 'onClick'],
        props: {
            room: String
        },
        components: {
            ErrorText,
            LoadingIcon
        },
        data: function () {
            return  {
                name: "",
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#editRoomModal div #closeModalButton').click()
            },
			editRoom () {
				this.isLoading = true
                var room = {
                    old_name: this.room,
                    name: this.name
                }
                this.errorText = ""
				this.$store.dispatch("editRoom", room).then(_res => {
					this.isLoading = false
                    this.closeModal()
					this.$emit('onEdit')
				}).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
			},
        }
    }
</script>

<style scoped>

</style>