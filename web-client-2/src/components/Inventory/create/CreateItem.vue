<template>
    <b-button v-b-modal.createItemModal @click="openCreateItem" style="max-height: 6vh">Create Item <template v-if="useID">with this ID</template>
        <b-modal size="lg" id="createItemModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Create Item" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <div class="row row-cols-10">
                    <div class="col-7">
                        <label for="create-item-name">Name:</label><br/><input id="create-item-name" v-model="itemName" placeholder="Enter a name..."><br/>
                        <label for="create-item-description">Description:</label><br/><input id="create-item-description" v-model="itemDescription" placeholder="Enter a description..."><br/>
                        <br>
                        <div v-for="f of customFieldsLoaded" :key="f.name">
                            <label :for="'custom-field-'+f.name">{{f.name}}:</label><br/>

                            <input v-if="f.type == 'text'" :id="'custom-field-'+f.name" v-model="customFields[f.name]" :placeholder="'Enter a value for '+f.name"/>

                            <input class="form-check-input" v-if="f.type == 'boolean'" type="checkbox" :id="'custom-field-'+f.name" v-model="customFields[f.name]"/>

                            <select v-if="f.type == 'list'"  :id="'custom-field-'+f.name" v-model="customFields[f.name]" class="form-select bg-light text-dark">
                                <option v-for="o of f.options" :key="o" :value="o">{{o}}</option>
                            </select>
                        </div>
                        <br>

                        <div v-if="!categoryName || !typeName" class="form-horizontal row row-cols-1 row-cols-lg-3">
                            <div class="col">
                                Category:
                                <select class="form-select bg-light text-dark" aria-label="Select Storage Room" @change="loadCustomFields()" v-model="categoryIndex" v-if="categories.length">
                                    <option v-for="(c, i) in categories" :key="i" :value="i">{{c.name}}</option>
                                </select>
                            </div>
                            <div>
                                Type:
                                <select class="form-select bg-light text-dark" aria-label="Select Storage Shelf" v-model="typeIndex" v-if="categories[categoryIndex]?.types.length">
                                    <option v-for="(t, i) in categories[categoryIndex].types" :key="i" :value="i">{{t}}</option>
                                </select>
                            </div>
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
                        <label for="create-item-amount">Amount:</label><br/><input id="create-item-amount" v-model="itemAmount" placeholder="Enter an amount..."><br/>
                        <image-upload-preview ref="image-upload"/><br/>
                    </div>
                    <div class="col-3">
                        Select an item as template:
                        <ul class="tree">
                            <li v-for="r of templateList" :key="r.name"><a class="text-dark" @click="clickTreeLink" href="#">{{r.name}}</a>
                                <ul>
                                    <li v-for="t of r.types" :key="t.name"><a class="text-dark" @click="clickTreeLink" href="#">{{t.name}}</a>
                                        <ul>
                                            <li v-for="i of t.equipment" :key="i.name">
                                                <a class="item-template text-dark" @click="fillInItem(i)" href="#">{{i.name}}</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                <loading-icon v-if="isLoading" size="3x"/>
                <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createItemModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createItem">Create Item</button>
            </div>
        </b-modal>
    </b-button>
</template>

<script>
    import ImageUploadPreview from "../../helpers/ImageUploadPreview.vue"
    import ErrorText from "../../helpers/ErrorText.vue"
    import LoadingIcon from "../../helpers/LoadingIcon.vue"

    export default {
        name: "CreateItem",
        emits: ['onCreate'],
        components: {
            ImageUploadPreview,
            ErrorText,
            LoadingIcon
        },
        props: {
            categoryName: String,
            typeName: String,
            useID: String
        },
        data: function () {
            return  {
                customFieldErrorText: "",
                itemName: "",
                itemDescription: "",
                customFieldName: "",
                customFieldsLoaded: [],
                customFields: {},
                itemAmount: 1,

                storage: [],
                roomIndex: 0,
                shelfIndex: 0,
                compIndex: 0,

                categories: [],
                categoryIndex: 0,
                typeIndex: 0,

                templateList: [],
                isLoading: false,
                errorText: "",
            }
        },
        methods: {
            closeModal () {
                $('#createItemModal div #closeModalButton').click()
            },
            clickTreeLink (e) {
                var parent = e.target.parentElement;
                var classList = parent.classList;
                if(classList.contains("open")) {
                    classList.remove('open');
                    var opensubs = parent.querySelectorAll(':scope .open');
                    for(var i = 0; i < opensubs.length; i++){
                        opensubs[i].classList.remove('open');
                    }
                } else {
                    classList.add('open');
                }
                e.preventDefault();
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

                    amount: +this.itemAmount,
                    custom_fields: this.customFields,
                    image: (!!this.$refs['image-upload'].previewImage) ? this.$refs['image-upload'].previewImage.split('base64,')[1] : undefined
                }

                if (!item.category && !this.categoryName)
                    item.category = this.categories[this.categoryIndex].name
                    
                if (!item.type && !this.typeName)
                    item.type = this.categories[this.categoryIndex].types[this.typeIndex]

                if (this.useID)
                    item.id = this.useID

                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("createItem", item).then(_answ => {
                    this.isLoading = false
                    this.$emit("onCreate")
                    this.closeModal()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
            fillInItem (item) {
                this.itemName = item.name + " - copy"
                this.roomIndex = this.storage.findIndex(r => r.name == item.room)
                this.shelfIndex = this.storage[this.roomIndex].shelfs.findIndex(s => s.name == item.shelf)
                this.compIndex = this.storage[this.roomIndex].shelfs[this.shelfIndex].compartments.findIndex(c => c.name == item.compartment)
                this.itemDescription = item.description
                this.itemAmount = item.amount
                this.$refs['image-upload']._url = this.$store.state.apiUrl + '/equipment/getimg/' + item.id

                for (var f of Object.keys(item.custom_fields)) {
                    if (this.customFieldsLoaded.indexOf(f.name) == -1)
                        continue
                    
                    this.customFields[f.name] = item.custom_fields[f.name]
                }
            },
            openCreateItem () {
                this.$store.dispatch("getCategories").then(res => {
                    this.categories = res.data
                    this.loadCustomFields()
                }).catch(err => {
                    this.errorText = err
                })
                this.$store.dispatch("getStorage").then(res => {
                    this.storage = res.data
                }).catch(err => {
                    this.errorText = err
                })
                this.$store.dispatch("getEquipment").then(res => {
                    this.templateList = res.data
                }).catch(err => {
                    this.errorText = err
                })
            },
            loadCustomFields () {                    
                for (var cat of this.categories) {
                    if (cat.name == this.categoryName || (this.categories.indexOf(cat) == this.categoryIndex && !this.categoryName)) {
                        this.customFieldsLoaded = cat.custom_fields
                        for (var f of this.customFieldsLoaded) {
                            this.customFields[f.name] = ""
                        }
                        return
                    }
                }
            }
        },
    }
</script>

<style scoped>
    ul.tree li {
        list-style-type: none;
        position: relative;
    }

    ul.tree li ul {
        display: none;
    }

    ul.tree li.open > ul {
        display: block;
    }

    ul.tree li a {
        text-decoration: none;
    }

    ul.tree li a.item-template {
        color: blue;
        text-decoration: blue;
        text-decoration-line: underline;
    }

    ul.tree li a:before {
        height: 1em;
        padding:0 .1em;
        font-size: .8em;
        display: block;
        position: absolute;
        left: -1.3em;
        top: .2em;
    }

    ul.tree li > a:not(:last-child):before {
        content: '‣';
    }

    ul.tree li.open > a:not(:last-child):before {
        content: '-';
    }
</style>
