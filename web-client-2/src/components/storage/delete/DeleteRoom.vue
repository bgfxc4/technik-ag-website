<template>
    <b-modal size="lg" id="deleteRoomModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Room" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h6>Do you really want to delete the room <b>{{room}}</b>?</h6>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteRoomModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteRoom">Delete Room</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "DeleteRoom",
        emits: ['onDelete', 'onClick'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            room: String,
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#deleteRoomModal div #closeModalButton').click()
            },
			deleteRoom () {
				this.isLoading = true
                this.errorText = ""
				this.$store.dispatch("deleteRoom", {name: this.room}).then(_res => {
					this.isLoading = false
                    this.closeModal()
                    setTimeout(() => {
                        this.$emit("onDelete")
                    }, 500)
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