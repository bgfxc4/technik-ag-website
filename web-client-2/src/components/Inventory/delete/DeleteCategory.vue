<template>
    <b-modal size="lg" id="deleteCategoryModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Category" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Do you really want to delete the category {{categoryName}} with all of it's content?</h5>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteCategoryModal>Cancel</button>
            <button class="btn btn-outline-danger" @click="deleteCategory">Delete Category</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"
    
    export default {
        name: "DeleteCategory",
        emits: ['onDelete'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            categoryName: String
        },
        computed: {
            showModal: categoryName => categoryName != undefined
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#deleteCategoryModal div #closeModalButton').click()
            },
            deleteCategory () {
                var category = {
                    name: this.categoryName,
                }
                this.errorText = ""
                this.isLoading = true
                this.$store.dispatch("deleteCategory", {category, callback: (_answ, err) => {
                    this.isLoading = false
                    if (err) {
                        this.errorText = err
                        return
                    }
                    this.$emit("onDelete")
                    this.closeModal()
                }})
            }
        }
    }
</script>

<style scoped>

</style>