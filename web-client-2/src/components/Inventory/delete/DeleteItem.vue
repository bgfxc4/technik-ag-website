<template>
    <b-modal size="lg" id="deleteItemModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Item" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Do you really want to delete the item {{itemId}}?</h5>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteItemModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteItem">Delete Item</button>
        </div>
    </b-modal>
</template>

<script>
    export default {
        name: "DeleteType",
        emits: ['onDelete'],
        props: {
            categoryName: String,
            typeName: String,
            itemId: String
        },
        data: function () {
            return  {
                errorText: "",
            }
        },
        methods: {
            closeModal () {
                $('#deleteItemModal div #closeModalButton').click()
            },
            deleteItem () {
                var item = {
                    id: this.itemId,
                    category: this.categoryName,
                    type: this.typeName
                }
                this.$store.dispatch("deleteItem", {item, callback: (answ, err) => {
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