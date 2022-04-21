<template>
    <b-button v-b-modal.createRequestModal style="max-height: 6vh">Create Appointment Request
        <b-modal size="lg" id="createRequestModal" class="text-secondary" centered hide-footer hide-header-close title="Create Appointment Request" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-req-name">Name:</label><br/><input id="create-req-name" v-model="reqName" placeholder="Enter a name..."><br/>
                <label for="create-req-desc">Description:</label><br/><input id="create-req-desc" v-model="reqDesc" placeholder="Enter a description..."><br/>

                <input id="create-req-multiple-d" type="checkbox" v-model="multipleDays" class="form-switch"><label for="create-req-multiple-d"> Multiple Days</label><br/>

                <date-picker v-if="!multipleDays" v-model="dateRange.start" :min-date='new Date()' :first-day-of-week="2" :masks="masks" :model-config="{type: 'number'}">
                    <template v-slot="{ inputValue, inputEvents }">
                        <input
                        class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                        :value="inputValue"
                        v-on="inputEvents"
                        />
                    </template>
                </date-picker>

                <date-picker v-else v-model="dateRange" is-range :min-date='new Date()' :first-day-of-week="2" :masks="masks" :model-config="{type: 'number'}">
                    <template v-slot="{ inputValue, inputEvents }">
                        <div class="flex justify-center items-center">
                        <input
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
                reqName: "",
                reqDesc: "",
                dateRange: {
                    start: 0,
                    end: 0,
                },

                multipleDays: false,

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
                    date: this.dateRange.start,
                    end_date: this.multipleDays ? this.dateRange.end : this.dateRange.start 
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
            }
        },
        watch: {
            date (newDate) {
                this.dateRange.start = newDate
            }
        }
    }
</script>

<style scoped>

</style>