<template>
    <b-button class="btn-sm mx-1" v-b-modal.createCompModal style="max-height: 6vh" @click="$emit('onClick')">Create Compartment
		<b-modal size="lg" id="createCompModal" class="text-secondary" centered hide-footer hide-header-close title="Create Compartment" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-comp-name">Name:</label><br/><input id="create-comp-name" v-model="name" placeholder="Enter a name..."><br/>
				<loading-icon v-if="isLoading" size="3x"/>
				<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createCompModal>Cancel</b-button>
				<button class="btn btn-outline-primary" @click="createComp">Create Compartment</button>
			</div>
		</b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "CreateCompartment",
        emits: ['onCreate', 'onClick'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            room: String,
            shelf: String
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
                $('#createCompModal div #closeModalButton').click()
            },
			createComp () {
				this.isLoading = true
				var comp = {
					room: this.room,
					shelf: this.shelf,
					name: this.name
				}
				this.$store.dispatch("createComp", {comp: comp, callback: (_res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.name = ""
                    this.closeModal()
					this.$emit("onCreate")
				}})
			},
        }
    }
</script>

<style scoped>

</style>