<template>
    <b-modal size="lg" id="editCategoryModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Edit Category" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="create-category-name">Name:</label><br/><input id="create-category-name" v-model="categoryName" placeholder="Enter a name..."><br/>
            <label for="create-fiel-name">New Custom Field:</label><br/><input id="create-field-name" v-model="customFieldName" placeholder="Enter a name..."><br>

            <button class="btn btn-secondary" @click="createCustomField">Create Custom Field</button><br/>
            <p class="text-danger" v-if="customFieldErrorText">{{ customFieldErrorText }}</p>
            <h6 v-if="customFields.length">Custom Fields:</h6>
            <h6 v-for="f in customFields" :key="f">-{{f}} <button class="btn btn-danger btn-sm" @click="deleteCustomField(customFields.indexOf(f))">Delete</button></h6>
            
            <image-upload-preview ref="image-upload"/><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editCategoryModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editCategory">Edit Category</button>
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
                if (/^\s*$/.test(this.customFieldName)) { // checks if string is only whitespaces
                    this.customFieldErrorText = "The name can not be empty!"
                    return
                }
                if (this.customFields.includes(this.customFieldName)) {
                    this.customFieldErrorText = "A custom field with this name exists already!"
                    return
                }
                this.customFieldErrorText = ""
                this.customFields.push(this.customFieldName)
            },
            deleteCustomField (i) {
                console.log(i)
	            this.customFields.splice(i, 1)
            },
            closeModal () {
                $('#editCategoryModal div #closeModalButton').click()
            },
            editCategory () {
                var category = {
                    old_name: this.category.name,
                    new_name: this.categoryName,
                    custom_fields: this.customFields,
                    image: (!!this.$refs['image-upload'].previewImage) ? this.$refs['image-upload'].previewImage.split('base64,')[1] : undefined
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editCategory", {category, callback: (_answ, err) => {
                    this.isLoading = false
                    if (err) {
                        this.errorText = err
                        return
                    }
                    this.$emit("onEdit")
                    this.closeModal()
                }})
            },
            fillInCategory () {
                console.log(this.category)
                this.categoryName = this.category.name
                this.customFields = this.category.custom_fields
                this.$refs['image-upload']._url = this.$store.state.apiUrl + '/category/getimg/' + this.category.name
            }
        }
    }
</script>

<style scoped>

</style>