<template>
    <b-button class="btn-sm mx-1" v-b-modal.createRoomModal style="max-height: 6vh">Create Room
        <b-modal size="lg" id="createRoomModal" class="text-secondary" centered hide-footer hide-header-close title="Create Room" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-room-name">Name:</label><br/><input id="create-room-name" v-model="name" placeholder="Enter a name..."><br/>
                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createRoomModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createRoom">Create Room</button>
            </div>
        </b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "CreateRoom",
        emits: ['onCreate'],
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
                $('#createRoomModal div #closeModalButton').click()
            },
			createRoom () {
				this.isLoading = true
				this.$store.dispatch("createRoom", {room: {name: this.name}, callback: (_res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
                    this.closeModal()
					this.$emit('onCreate')
				}})
			},
        }
    }
</script>

<style scoped>

</style>