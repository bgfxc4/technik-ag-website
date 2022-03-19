<template>
    <b-button v-b-modal.createCategoryModal style="max-height: 6vh">Create Category
        <b-modal size="lg" id="createCategoryModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Create Category" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-category-name">Name:</label><br/><input id="create-category-name" v-model="categoryName" placeholder="Enter a name..."><br/>
                <label for="create-fiel-name">New Custom Field:</label><br/><input id="create-field-name" v-model="customFieldName" placeholder="Enter a name..."><br>

                <button class="btn btn-secondary" @click="createCustomField">Create Custom Field</button><br/>
                <p class="text-danger" v-if="customFieldErrorText">{{ customFieldErrorText }}</p>
                <h6 v-if="customFields.length">Custom Fields:</h6>
                <h6 v-for="f in customFields" :key="f">-{{f}} <button class="btn btn-danger btn-sm" @click="deleteCustomField(customFields.indexOf(f))">Delete</button></h6>
                
                <image-upload-preview ref="image-upload"/><br/>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createCategoryModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createCategory">Create Category</button>
            </div>
        </b-modal>
    </b-button>
</template>

<script>
    import ImageUploadPreview from "../../helpers/ImageUploadPreview.vue"

    export default {
        name: "CreateCategory",
        emits: ['onCreate'],
        components: {
            ImageUploadPreview
        },
        data: function () {
            return  {
                customFieldErrorText: "",
                categoryName: "",
                customFieldName: "",
                customFields: [],
                errorText: "",
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
                $('#createCategoryModal div #closeModalButton').click()
            },
            createCategory () {
                var category = {
                    name: this.categoryName,
                    custom_fields: this.customFields,
                    image: (!!this.$refs['image-upload'].previewImage) ? this.$refs['image-upload'].previewImage.split('base64,')[1] : undefined
                }
                this.$store.dispatch("createCategory", {category, callback: (answ, err) => {
                    if (!answ) {
                        this.errorText = err
                        return
                    } else {
                        this.$emit("onCreate")
                    }
                    this.closeModal()
                }})
            }
        }
    }
</script>

<style scoped>

</style>