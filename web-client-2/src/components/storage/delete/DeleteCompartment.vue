<template>
    <b-button class="btn-sm mx-1 btn-danger" v-b-modal.deleteCompModal style="max-height: 6vh" @click="$emit('onClick')"><font-awesome-icon icon="trash-can"/>
		<b-modal size="lg" id="deleteCompModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Compartment" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<h6>Do you really want to delete the compartment?</h6>
				<loading-icon v-if="isLoading" size="3x"/>
				<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteCompModal>Cancel</b-button>
				<button class="btn btn-outline-danger" @click="deleteComp">Delete Compartment</button>
			</div>
		</b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "DeleteComp",
        emits: ['onDelete', 'onClick'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            room: String,
            shelf: String,
            comp: String
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#deleteCompModal div #closeModalButton').click()
            },
			deleteComp () {
				this.isLoading = true
				var comp = {
					room: this.room,
					shelf: this.shelf,
					name: this.comp
				}
				this.errorText = ""
				this.$store.dispatch("deleteComp", {comp: comp, callback: (_res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.$emit("onDelete")
                    this.closeModal()
				}})
			},
        }
    }
</script>

<style scoped>

</style>