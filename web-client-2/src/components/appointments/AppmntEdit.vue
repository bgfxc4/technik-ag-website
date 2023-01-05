<template>
    <b-modal size="lg" id="appmntEditModal" class="text-secondary" centered hide-footer hide-header-close title="Edit Appointment" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <h5>Fill in the fields you want to edit:</h5>

            <label for="edit-appmnt-name">Name:</label><br/><input id="edit-appmnt-name" v-model="appmntName" placeholder="Enter a name..."><br/>
            <label for="edit-appmnt-desc">Description:</label><br/><input id="edit-appmnt-desc" v-model="appmntDesc" placeholder="Enter a description..."><br/>
            <label for="edit-appmnt-contact">Contact:</label><br/><input id="edit-appmnt-contact" v-model="appmntContact" placeholder="Enter contact information..."><br/>

            <date-picker ref="picker" mode="dateTime" v-model="dateRange" is-range :min-date='new Date()' is24hr :first-day-of-week="2" :masks="masks" :model-config="{type: 'number'}" is-required>
                    <template v-slot="{ inputValue, inputEvents }">
                        <div class="flex justify-center items-center">
                        <input
                            id="dateTimeInputStart"
                            :value="inputValue.start"
                            v-on="inputEvents.start"
                            class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
                        />
                        <font-awesome-icon icon="arrow-right"/>
                        <input
                            :value="inputValue.end"
                            v-on="inputEvents.end"
                            class="border px-2 py-1 w-32 rounded focus:outline-none focus:border-indigo-300"
                        />
                        </div>
                    </template>
                </date-picker>
            
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <button id="closeModalButton" class="btn btn-outline-primary" v-b-modal.appmntInfoModal>Cancel</button>
            <button class="btn btn-info mx-2" @click="apply">Edit</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../helpers/ErrorText.vue"
    import LoadingIcon from "../helpers/LoadingIcon.vue"
    import {DatePicker} from "v-calendar"

    export default {
        name: "AppmntEdit",
        emits: ['onChange'],
        components: {
            ErrorText,
            LoadingIcon,
            DatePicker
        },
        props: {
            appmntID: String
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false,
                appmntName: "",
                appmntDesc: "",
                appmntContact: "",
                dateRange: {
                    start: null,
                    end: null,
                },

                masks: {
                    input: ['DD.MM.YYYY'],
                },
            }
        },
        methods: {
            closeModal () {
                $('#appmntEditModal div #closeModalButton').click()
            },
            apply () {
                var appmnt = {
                    id: this.$props.appmntID,
                }

                if (this.appmntName)
                    appmnt.name = this.appmntName

                if (this.appmntDesc)
                    appmnt.name = this.appmntDesc

                if (this.appmntContact)
                    appmnt.name = this.appmntContact

                if (this.dateRange.start && this.dateRange.end) {
                    appmnt.date = this.dateRange.start
                    appmnt.end_date = this.dateRange.end
                }

                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("editAppmnt", appmnt).then(() => {
                    this.$emit("onChange")
                    this.closeModal()
                    this.isLoading = false
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                })
            }
        }
    }
</script>

<style>
</style>