<template>
    <b-modal size="lg" id="appmntEditItemsModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Booked Items" header="test" @show="open" header-class="justify-content-center">
        <div class="modal-body text-center">
            <b>Booked Items:</b><br>
            <template v-for="(i, idx) of itemsToEdit" :key="i.id">
                <img v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + i.id" style="max-width: 5vw; max-height: 5vh; width: auto; height: auto; margin-left: 10px; border-radius: 3px">
                {{i.name}} - Max. Amount: {{i.maxAmount}} - Amount: 
                <div class="input-group" style="display: inline">
                    <input type="button" @click="itemsToEdit[idx].amount--; checkItemAmount(idx)" value="-" class="button-minus" data-field="quantity">
                    <input type="number" @change="checkItemAmount(idx)" v-model="itemsToEdit[idx].amount" step="1" :max="itemsToEdit[idx].maxAmount" min="1" name="quantity" class="quantity-field">
                    <input type="button" @click="itemsToEdit[idx].amount++; checkItemAmount(idx)" value="+" class="button-plus" data-field="quantity">
                </div>
                <button class="btn btn-danger btn-sm" @click="deleteItem(idx)"><font-awesome-icon icon="trash-can"/></button>
                <br>
            </template>
            <template v-if="!items.length">none</template><br>
            <button class="btn btn-outline-primary" @click="calcSelectItemIgnore(); $refs['itemSelector'].show()"><font-awesome-icon icon="plus"/></button>
            <item-selector :onlyIfAvailable="true" :duringAppointment="appmntID" @selected="addItem" :ignoreIDs="itemSelectIgnore" ref="itemSelector"/><br><br>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <button id="closeModalButton" class="btn btn-outline-primary" v-b-modal.appmntInfoModal>Cancel</button>
            <button class="btn btn-info mx-2" @click="apply">Apply</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../helpers/ErrorText.vue"
    import LoadingIcon from "../helpers/LoadingIcon.vue"
    import ItemSelector from "../helpers/ItemSelector.vue"

    export default {
        name: "AppmntEditItems",
        emits: ['onChange'],
        components: {
            ErrorText,
            LoadingIcon,
            ItemSelector
        },
        props: {
            items: Object,
            appmntID: String
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false,
                itemsToEdit: [],
                itemSelectIgnore: [],
                itemDBObject: []
            }
        },
        methods: {
            closeModal () {
                $('#appmntEditItemsModal div #closeModalButton').click()
            },
            addItem(item) {
                item.maxAmount = item.available_amount
                item.amount = 1

                if (item.maxAmount)
                    return this.itemsToEdit.push(item)

                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getOneEquipmentDuringAppointment", {appointment: this.appmntID, id: item.id}).then(res => {
                    this.isLoading = false
                    item.maxAmount = res.data.available_amount
                    this.itemsToEdit.push(item)
                }).catch(err => {
                    this.errorText = err
                    this.isLoading = false
                })

            },
            calcSelectItemIgnore () {
                this.itemSelectIgnore = []
                for (var i of  this.itemsToEdit) {
                    this.itemSelectIgnore.push(i.id)
                }
            },
            checkItemAmount (idx) {
                this.itemsToEdit[idx].amount = Math.max(this.itemsToEdit[idx].amount, 1)
                this.itemsToEdit[idx].amount = Math.min(this.itemsToEdit[idx].amount, this.itemsToEdit[idx].maxAmount)
            },
            deleteItem (idx) {
                this.itemsToEdit.splice(idx, 1)
            },
            apply () {
                var toSend = {
                    id: this.appmntID,
                    items: []
                }
                for (var i of this.itemsToEdit) {
                    toSend.items.push({id: i.id, amount: i.amount})
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("updateAppmntItems", toSend).then(() => {
                    this.$emit("onChange")
                    this.closeModal()
                    this.isLoading = false
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            },
            open () {
                this.$store.dispatch("getEquipmentDuringAppointment", {appointment: this.appmntID}).then(res => {
                    this.itemDBObject = res.data
                    this.itemsToEdit = []

                    var itemDBList = []
                    for (var c of this.itemDBObject) {
                        for (var t of c.types) {
                            for (var i of t.equipment) {
                                itemDBList.push(i)
                            }
                        }
                    }

                    for (var i of this.items) {
                        i.maxAmount = itemDBList.find(e => e.id == i.id).available_amount
                        this.itemsToEdit.push(i)
                    }
                }).catch(err => {
                    this.errorText = err
                })
            }
        }
    }
</script>

<style>
    input,
    textarea {
        border: 1px solid #eeeeee;
        box-sizing: border-box;
        margin: 0;
        outline: none;
        padding: 10px;
    }

    input[type="button"] {
        -webkit-appearance: button;
        cursor: pointer;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    .input-group {
        clear: both;
        margin: 15px 0;
        position: relative;
    }

    .input-group input[type='button'] {
        background-color: #eeeeee;
        min-width: 38px;
        width: auto;
        transition: all 300ms ease;
    }

    .input-group .button-minus,
    .input-group .button-plus {
        font-weight: bold;
        height: 38px;
        padding: 0;
        width: 38px;
        position: relative;
    }

    .input-group .quantity-field {
        position: relative;
        height: 38px;
        left: -6px;
        text-align: center;
        width: 62px;
        display: inline-block;
        font-size: 13px;
        margin: 0 0 5px;
        resize: vertical;
    }

    .button-plus {
        left: -13px;
    }

    input[type="number"] {
        -moz-appearance: textfield;
        -webkit-appearance: none;
    }

</style>