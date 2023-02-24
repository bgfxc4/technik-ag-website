<template>
    <b-modal size="lg" id="editCategoryModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Edit Category" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="edit-category-name">Name:</label><br/><input id="edit-category-name" v-model="categoryName" placeholder="Enter a name..."><br/>

            <button class="btn btn-secondary" v-b-modal.editCategoryModal v-b-modal.editCreateFieldModal>Create Custom Field</button><br/>

            <h6 v-if="customFields?.length">Custom Fields:</h6>
            <h6 v-for="f in customFields" :key="f.name"><b>Name:</b> {{f.name}} <b>Type:</b> {{f.type}} <button class="btn btn-danger btn-sm" @click="deleteCustomField(customFields.indexOf(f))">Delete</button></h6>
            
            <image-upload-preview ref="image-upload"/><br/>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editCategoryModal>Cancel</b-button>
            <button class="btn btn-outline-info" @click="editCategory">Edit Category</button>
        </div>
    </b-modal>

    <b-modal id="editCreateFieldModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Create Custom Field" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="create-field-name">Name:</label><br/><input id="create-field-name" v-model="customFieldName" placeholder="Enter a name..."><br/>
            
            <label for="field-type-select">Type:</label><br/>
            <select id="field-type-select" class="form-select bg-light text-dark" v-model="fieldType">
                <option value="text">Text</option>
                <option value="boolean">Boolean (True/False)</option>
                <option value="list">Fixed List</option>
            </select>

            <template v-if="fieldType=='list'">
                <label for="create-option-name">Name:</label><input id="create-option-name" v-model="optionName" placeholder="Enter a name...">
                <button class="btn btn-secondary" @click="createOption">Create Option</button><br/>

                <h6 v-if="fieldOptions?.length">Options:</h6>
                <h6 v-for="f in fieldOptions" :key="f">-{{f}} <button class="btn btn-danger btn-sm" @click="deleteOption(fieldOptions.indexOf(f))">Delete</button></h6>
                <p class="text-danger" v-if="optionsErrorText">{{ optionsErrorText }}</p>
            </template>

            <p class="text-danger" v-if="customFieldErrorText">{{ customFieldErrorText }}</p>

            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editCreateFieldModal v-b-modal.editCategoryModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="createCustomField">Create Field</button>
        </div>
    </b-modal>
</template>

<script>
    import ImageUploadPreview from "../../helpers/ImageUploadPreview.vue"
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "EditCategory",
        emits: ['onEdit'],
        props: {
            category: Object
        },
        components: {
            ImageUploadPreview,
            ErrorText,
            LoadingIcon
        },
        data: function () {
            return  {
                fieldType: 'text',
                fieldOptions: [],
                optionName: "",
                optionsErrorText: "",

                customFieldErrorText: "",
                categoryName: "",
                customFieldName: "",
                customFields: [],
                errorText: "",
                isLoading: false
            }
        },
        watch: {
            category(n) {
                if (n != {} && n != undefined)
                    this.fillInCategory()
            }
        },
        methods: {
            createCustomField () {
                if (this.customFields == null) this.customFields = []
                if (/^\s*$/.test(this.customFieldName)) { // checks if string is only whitespaces
                    this.customFieldErrorText = "The name can not be empty!"
                    return
                }
                let filtered = this.customFields?.filter(f => f.name == this.customFieldName)
                if (filtered?.length != 0) {
                    this.customFieldErrorText = "A custom field with this name exists already!"
                    return
                }
                this.customFieldErrorText = ""
                var field = {
                    name: this.customFieldName,
                    type: this.fieldType
                }
                if (this.fieldType == "list") {
                    field.options = this.fieldOptions
                }
                this.customFields.push(field)
                this.closeFieldModal()
                this.closeModal()
            },
            createOption () {
                if (/^\s*$/.test(this.optionName)) { // checks if string is only whitespaces
                    this.optionsErrorText = "The name can not be empty!"
                    return
                }
                if (this.fieldOptions.includes(this.optionName)) {
                    this.optionsErrorText = "An option with this name exists already!"
                    return
                }
                this.optionsErrorText = ""
                this.fieldOptions.push(this.optionName)
            },  
            deleteCustomField (i) {
                console.log(i)
	            this.customFields.splice(i, 1)
            },
            closeFieldModal () {
                $('#createFieldModal div #closeModalButton').click()
            },
            closeModal () {
                $('#editCategoryModal div #closeModalButton').click()
            },
            editCategory () {
                var category = {
                    id: this.category.id,
                    new_name: this.categoryName,
                    custom_fields: this.customFields,
                    image: (!!this.$refs['image-upload'].previewImage) ? this.$refs['image-upload'].previewImage.split('base64,')[1] : undefined
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editCategory", category).then(_answ => {
                    this.isLoading = false
                    this.$emit("onEdit")
                    this.closeModal()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
            fillInCategory () {
                this.categoryName = this.category.name
                this.customFields = this.category.custom_fields || []
                this.$refs['image-upload']._url = this.$store.state.apiUrl + '/category/getimg/' + this.category.id
            }
        }
    }
</script>

<style scoped>

</style>
