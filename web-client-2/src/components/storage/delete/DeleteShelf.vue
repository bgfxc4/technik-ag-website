<template>
    <b-button class="btn-sm mx-1 btn-danger" v-b-modal.deleteShelfModal style="max-height: 6vh" @click="$emit('onClick')"><font-awesome-icon icon="trash-can"/>
		<b-modal size="lg" id="deleteShelfModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Shelf" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<h6>Do you really want to delete the shelf?</h6>
				<loading-icon v-if="isLoading" size="3x"/>
				<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteShelfModal>Cancel</b-button>
				<button class="btn btn-outline-danger" v-b-modal.deleteShelfModal @click="deleteShelf">Create Shelf</button>
			</div>
		</b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "DeleteShelf",
        emits: ['onDelete', 'onClick'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            room: String,
            shelf: String,
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#deleteShelfModal div #closeModalButton').click()
            },
			deleteShelf () {
				this.isLoading = true
				var shelf = {
					room: this.room,
					name: this.shelf
				}
                this.errorText = ""
				this.$store.dispatch("deleteShelf", shelf).then(_res => {
					this.isLoading = false
                    this.closeModal()
					this.$emit("onDelete")
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