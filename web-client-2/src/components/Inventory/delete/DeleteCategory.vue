<template>
    <b-modal size="lg" id="deleteCategoryModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Category" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Do you really want to delete the category {{categoryName}} with all of it's content?</h5>
            <button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteCategoryModal>Cancel</button>
            <button class="btn btn-outline-danger" @click="deleteCategory">Delete Category</button>
        </div>
    </b-modal>
</template>

<script>

    export default {
        name: "DeleteCategory",
        emits: ['onDelete'],
        props: {
            categoryName: String
        },
        computed: {
            showModal: categoryName => categoryName != undefined
        },
        data: function () {
            return  {
                errorText: "",
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
                this.$store.dispatch("deleteCategory", {category, callback: (answ, err) => {
                    if (!answ) {
                        this.errorText = err
                        return
                    } else {
                        this.$emit("onDelete")
                    }
                    this.closeModal()
                }})
            }
        }
    }
</script>

<style scoped>

</style>