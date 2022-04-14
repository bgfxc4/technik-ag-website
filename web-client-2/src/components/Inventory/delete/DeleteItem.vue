<template>
    <b-modal size="lg" id="deleteItemModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Item" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Do you really want to delete the item {{itemId}}?</h5>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteItemModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteItem">Delete Item</button>
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
            typeName: String,
            itemId: String
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#deleteItemModal div #closeModalButton').click()
            },
            deleteItem () {
                var item = {
                    id: this.itemId
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("deleteItem", {item, callback: (_answ, err) => {
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