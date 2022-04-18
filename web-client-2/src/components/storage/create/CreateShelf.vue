<template>
    <b-button class="btn-sm mx-1" v-b-modal.createShelfModal style="max-height: 6vh" @click="$emit('onClick')">Create Shelf
		<b-modal size="lg" id="createShelfModal" class="text-secondary" centered hide-footer hide-header-close title="Create Shelf" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-shelf-name">Name:</label><br/><input id="create-shelf-name" v-model="name" placeholder="Enter a name..."><br/>
				<loading-icon v-if="isLoading" size="3x"/>
				<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createShelfModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="createShelf">Create Shelf</button>
			</div>
		</b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "CreateShelf",
        emits: ['onCreate', 'onClick'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            room: String
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
                $('#createShelfModal div #closeModalButton').click()
            },
			createShelf () {
				this.isLoading = true
				var shelf = {
					room: this.room,
					name: this.name
				}
                this.errorText = ""
				this.$store.dispatch("createShelf", shelf).then(_res => {
					this.isLoading = false
                    this.closeModal()
                    this.name = ""
					this.$emit('onCreate')
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