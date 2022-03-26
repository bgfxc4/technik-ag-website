<template>
    <b-modal size="lg" id="editItemModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Edit Item" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="edit-item-name">Name:</label><br/><input id="edit-item-name" v-model="itemName" placeholder="Enter a name..."><br/>
            <label for="edit-item-description">Description:</label><br/><input id="edit-item-description" v-model="itemDescription" placeholder="Enter a description..."><br/>
            <br>
            <div v-for="f of customFieldsLoaded" :key="f">
                <label :for="'custom-field-'+f">{{f}}:</label><input :id="'custom-field-'+f" v-model="customFields[f]" :placeholder="'Enter a value for '+f"/>
            </div>
            <br>
            <div class="form-horizontal row row-cols-1 row-cols-lg-3">
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

            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editItemModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editItem">Edit Item</button>
        </div>
    </b-modal>
</template>

<script>
    import ImageUploadPreview from "../../helpers/ImageUploadPreview.vue"

    export default {
        name: "EditItem",
        emits: ['onEdit'],
        props: {
            item: Object
        },
        components: {
            ImageUploadPreview
        },
        data: function () {
            return  {
                itemName: "",
                itemDescription: "",
                customFields: [],
                customFieldsLoaded: [],

                storage: [],

                roomIndex: 0,
                shelfIndex: 0,
                compIndex: 0,

                errorText: "",
            }
        },
        watch: {
            item(n) {
                if (n != {} && n != undefined)
                    this.fillInItem()
            }
        },
        methods: {
            closeModal () {
                $('#editItemModal div #closeModalButton').click()
            },
            editItem () {
                var item = {
                    id: this.item.id,
                    name: this.itemName,
                    description: this.itemDescription,

                    room: this.storage[this.roomIndex].name,
                    shelf: this.storage[this.roomIndex].shelfs[this.shelfIndex].name,
                    compartment: this.storage[this.roomIndex].shelfs[this.shelfIndex].compartments[this.compIndex].name,

                    category: this.item.category,
                    type: this.item.type,

                    custom_fields: this.customFields,
                    image: (!!this.$refs['image-upload'].previewImage) ? this.$refs['image-upload'].previewImage.split('base64,')[1] : undefined
                }
                this.$store.dispatch("editItem", {item, callback: (answ, err) => {
                    if (!answ) {
                        this.errorText = err
                        return
                    } else {
                        this.$emit("onEdit")
                    }
                    this.closeModal()
                }})
            },
            fillInItem () {
                console.log(this.item)
                this.itemName = this.item.name
                this.itemDescription = this.item.description
                this.customFields = this.item.custom_fields
                this.$refs['image-upload']._url = this.$store.state.apiUrl + '/equipment/getimg/' + this.item.id

                this.$store.dispatch("getStorage", (res, err) => {
                    if (err) {
                        this.errorText = err
                        return
                    }
                    this.storage = res.data
                    this.roomIndex = this.storage.findIndex(r => r.name == this.item.room)
                    this.shelfIndex = this.storage[this.roomIndex].shelfs.findIndex(s => s.name == this.item.shelf)
                    this.compIndex = this.storage[this.roomIndex].shelfs[this.shelfIndex].compartments.findIndex(c => c.name == this.item.compartment)
                })

                this.$store.dispatch("getCategories", (res, err) => {
                    if (err) {
                        this.errorText = err
                        return
                    }
                    for (var cat of res.data) {
                        if (cat.name == this.item.category) {
                            this.customFieldsLoaded = cat.custom_fields
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>