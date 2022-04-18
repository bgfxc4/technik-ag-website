<template>
    <b-button v-b-modal.createTypeModal style="max-height: 6vh">Create Type
        <b-modal size="lg" id="createTypeModal" class="text-secondary" centered hide-footer hide-header-close title="Create Type" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-type-name">Name:</label><br/><input id="create-type-name" v-model="typeName" placeholder="Enter a name..."><br/>
                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createTypeModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createType">Create Type</button>
            </div>
        </b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "CreateType",
        emits: ['onCreate'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            categoryName: String
        },
        data: function () {
            return  {
                typeName: "",
                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#createTypeModal div #closeModalButton').click()
            },
            createType () {
                var type = {
                    name: this.typeName,
                    category: this.categoryName
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("createType", type).then(_answ => {
                    this.isLoading = false
                    this.$emit("onCreate")
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