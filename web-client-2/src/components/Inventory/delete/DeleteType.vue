<template>
    <b-modal size="lg" id="deleteTypeModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Type" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Do you really want to delete the type {{typeName}} with all of it's content?</h5>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteTypeModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteType">Delete Type</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "DeleteType",
        emits: ['onDelete'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            categoryName: String,
            typeName: String
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#deleteTypeModal div #closeModalButton').click()
            },
            deleteType () {
                var type = {
                    name: this.typeName,
                    category: this.categoryName
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("deleteType", type).then(_answ => {
                    this.isLoading = false
                    this.$emit("onDelete")
                    this.closeModal()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            }
        }
    }
</script>

<style scoped>

</style>