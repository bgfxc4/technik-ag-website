<template>
    <b-modal size="lg" id="editCompModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Comp" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            Enter a new name for the compartment <b>{{comp}}</b>:<br>
            <label for="edit-comp-name">Name:</label><br/><input id="edit-comp-name" v-model="name" placeholder="Enter a name..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editCompModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editComp">Edit Comp</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "EditComp",
        emits: ['onEdit', 'onClick'],
        props: {
            room: String,
            shelf: String,
            comp: String
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
                $('#editCompModal div #closeModalButton').click()
            },
			editComp () {
				this.isLoading = true
                var comp = {
                    room: this.room,
                    shelf: this.shelf,
                    old_name: this.comp,
                    name: this.name
                }
                this.errorText = ""
				this.$store.dispatch("editComp", comp).then(_res => {
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