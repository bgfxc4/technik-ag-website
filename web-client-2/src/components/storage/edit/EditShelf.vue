<template>
    <b-modal size="lg" id="editShelfModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Shelf" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            Enter a new name for the shelf <b>{{shelf}}</b>:<br>
            <label for="edit-shelf-name">Name:</label><br/><input id="edit-shelf-name" v-model="name" placeholder="Enter a name..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editShelfModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editShelf">Edit Shelf</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "EditShelf",
        emits: ['onEdit', 'onClick'],
        props: {
            room: String,
            shelf: String
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
                $('#editShelfModal div #closeModalButton').click()
            },
			editShelf () {
				this.isLoading = true
                var shelf = {
                    room: this.room,
                    old_name: this.shelf,
                    name: this.name
                }
                this.errorText = ""
				this.$store.commit("editShelf", shelf).then(_res => {
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