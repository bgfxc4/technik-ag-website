<template>
    <b-modal size="lg" id="deleteTypeModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Type" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Do you really want to delete the type {{typeName}} with all of it's content?</h5>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteTypeModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteType">Delete Type</button>
        </div>
    </b-modal>
</template>

<script>
    export default {
        name: "DeleteType",
        emits: ['onDelete'],
        props: {
            categoryName: String,
            typeName: String
        },
        data: function () {
            return  {
                errorText: "",
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
                this.$store.dispatch("deleteType", {type, callback: (answ, err) => {
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