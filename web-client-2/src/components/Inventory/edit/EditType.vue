<template>
    <b-modal size="lg" id="editTypeModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Edit Type" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="edit-type-name">Name:</label><br/><input id="edit-type-name" v-model="typeName" placeholder="Enter a name..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editTypeModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editType">Edit Type</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "EditType",
        emits: ['onEdit'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            type: Object,
            catName: String
        },
        data: function () {
            return  {
                typeName: "",
                errorText: "",
                isLoading: false
            }
        },
        watch: {
            type(n) {
                if (n != {} && n != undefined)
                    this.fillInType()
            }
        },
        methods: {
            closeModal () {
                $('#editTypeModal div #closeModalButton').click()
            },
            editType () {
                var type = {
                    old_name: this.type.name,
                    new_name: this.typeName,
                    category: this.catName
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editType", type).then(_answ => {
                    this.isLoading = false
                    this.$emit("onEdit")
                    this.closeModal()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
            fillInType () {
                console.log(this.type)
                this.typeName = this.type.name
            }
        }
    }
</script>

<style scoped>

</style>