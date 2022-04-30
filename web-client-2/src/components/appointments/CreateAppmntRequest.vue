<template>
    <b-button @click="open" v-b-modal.createRequestModal style="max-height: 6vh">Create Appointment Request
        <b-modal size="lg" id="createRequestModal" class="text-secondary" centered hide-footer hide-header-close title="Create Appointment Request" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-req-name">Name:</label><br/><input id="create-req-name" v-model="reqName" placeholder="Enter a name..."><br/>
                <label for="create-req-desc">Description:</label><br/><input id="create-req-desc" v-model="reqDesc" placeholder="Enter a description..."><br/>
                <label for="create-req-cont">Contact Information:</label><br/><input id="create-req-cont" v-model="reqContact" placeholder="Enter your contact information..."><br/>
                <label for="create-req-needed">Needed Items (optional):</label><br/><input id="create-req-needed" v-model="reqNeededItems" placeholder="Enter a list of items you need..."><br/>

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
                <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createRequestModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createRequest">Create Request</button>
            </div>
        </b-modal>
    </b-button>
</template>

<script>
    import ErrorText from "../helpers/ErrorText.vue"
    import LoadingIcon from "../helpers/LoadingIcon.vue"
    import {DatePicker} from "v-calendar"

    export default {
        name: "CreateAppmntRequest",
        emits: ['onCreate'],
        components: {
            ErrorText,
            LoadingIcon,
            DatePicker
        },
        props: {
            date: Number
        },
        data: function () {
            return  {
                reqName: undefined,
                reqDesc: undefined,
                reqContact: undefined,
                reqNeededItems: undefined,
                dateRange: {
                    start: null,
                    end: null,
                },

                masks: {
                    input: ['DD.MM.YYYY'],
                },

                errorText: "",
                isLoading: false
            }
        },
        methods: {
            closeModal () {
                $('#createRequestModal div #closeModalButton').click()
            },
            createRequest () {
                var request = {
                    name: this.reqName,
                    description: this.reqDesc,
                    contact: this.reqContact,
                    needed_items: this.reqNeededItems,
                    date: this.dateRange.start,
                    end_date: this.dateRange.end
                }
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("requestAppointment", request).then(_ => {
                    this.isLoading = false
                    this.$emit("onCreate")
                    this.closeModal()
                }).catch(err => {
                    this.isLoading = false
                    this.errorText = err
                    return
                })
            },
            open () {
                this.dateRange.start = this.date
                this.dateRange.end = this.date
                this.$refs["picker"].updateValue(this.dateRange)
            }
        }
    }
</script>

<style scoped>

</style>