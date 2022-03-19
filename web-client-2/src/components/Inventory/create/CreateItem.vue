<template>
    <b-button v-b-modal.createItemModal @click="openCreateItem" style="max-height: 6vh">Create Item
        <b-modal size="lg" id="createItemModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Create Item" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-item-name">Name:</label><br/><input id="create-item-name" v-model="itemName" placeholder="Enter a name..."><br/>

                <label for="create-item-description">Description:</label><br/><input id="create-item-description" v-model="itemDescription" placeholder="Enter a description..."><br/>
                <br>
                <div v-for="f of customFieldsLoaded" :key="f">
                    <label :for="'custom-field-'+f">{{f}}:</label><input :id="'custom-field-'+f" v-model="customFields[f]" :placeholder="'Enter a value for '+f"/>
                </div>
                <br>
                <div class="form-horizontal row row-cols-3">
                    <div class="col">
                        Room:
                        <select class="form-select bg-light text-dark" aria-label="Select Storage Room" v-model="roomIndex" v-if="storage.length">
                            <option v-for="(r, i) in storage" :key="i" :value="i">{{r.name}}</option>
                        </select>
                    </div>
                    <div>
                        Shelf:
                        <select class="form-select bg-light text-dark" aria-label="Select Storage Shelf" v-model="shelfIndex" v-if="storage[roomIndex]?.shelfs.length">
                            <option v-for="(s, i) in storage[roomIndex].shelfs" :key="i" :value="i">{{s.name}}</option>
                        </select>
                    </div>
                    <div>
                        Compartment:
                        <select class="form-select bg-light text-dark" aria-label="Select Storage Compartment" v-model="compIndex" v-if="storage[roomIndex]?.shelfs[shelfIndex]?.compartments.length">
                            <option v-for="(c, i) in storage[roomIndex].shelfs[shelfIndex].compartments" :key="i" :value="i">{{c.name}}</option>
                        </select>
                    </div>
                </div>

                <image-upload-preview ref="image-upload"/><br/>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createItemModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createItem">Create Item</button>
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
        props: {
            categoryName: String,
            typeName: String,
        },
        data: function () {
            return  {
                customFieldErrorText: "",
                itemName: "",
                itemDescription: "",
                customFieldName: "",
                customFieldsLoaded: [],
                customFields: {},

                storage: {},
                roomIndex: 0,
                shelfIndex: 0,
                compIndex: 0,

                errorText: "",
            }
        },
        methods: {
            closeModal () {
                $('#createItemModal div #closeModalButton').click()
            },
            createItem () {
                var item = {
                    category: this.categoryName,
                    type: this.typeName,
                    name: this.itemName,
                    description: this.itemDescription,

                    room: this.storage[this.roomIndex].name,
                    shelf: this.storage[this.roomIndex].shelfs[this.shelfIndex].name,
                    compartment: this.storage[this.roomIndex].shelfs[this.shelfIndex].compartments[this.compIndex].name,

                    custom_fields: this.customFields,
                    image: (!!this.$refs['image-upload'].previewImage) ? this.$refs['image-upload'].previewImage.split('base64,')[1] : undefined
                }
                this.$store.dispatch("createItem", {item, callback: (answ, err) => {
                    if (!answ) {
                        this.errorText = err
                        return
                    } else {
                        this.$emit("onCreate")
                    }
                    this.closeModal()
                }})
            },
            openCreateItem () {
                this.$store.dispatch("getCategories", (res, err) => {
                    if (err) {
                        this.errorText = err
                        return
                    }
                    for (var cat of res.data) {
                        if (cat.name == this.categoryName) {
                            this.customFieldsLoaded = cat.custom_fields
                            for (var f of this.customFieldsLoaded) {
                                this.customFields[f] = ""
                            }
                            return
                        }
                    }
                })
                this.$store.dispatch("getStorage", (res, err) => {
                    if (err) {
                        this.errorText = err
                        return
                    }
                    this.storage = res.data
                    console.log(this.storage)
                })
            }
        },
    }
</script>

<style scoped>

</style>