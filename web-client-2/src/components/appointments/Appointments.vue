<template>
    <div id="appointments" class="container">
        <div class="row mt-4 top-row">
            <div class="col-md-6 col-12" style="height: 90%">
                <h4>Appointments:</h4>
                <appointment-calendar @update="getAppointments" ref="calendar" />
            </div>
            <div class="col-md-2 col-12"/>
            <div class="col-md-4 col-12" style="height: 100%">
                <request-list @update="getAppointments" ref="reqList"/>
            </div>
            <div class="col-md-3 col-12 mt-4 pb-4">
                <h5>Select a date to request an appointment:</h5>
                <date-picker :min-date='new Date()' :first-day-of-week="2" class="col-4" v-model="createDate" mode="dateTime" :model-config="{type: 'number'}" is24hr is-expanded/>
                <create-appmnt-request @onCreate="getAppointments" v-show="createDate" :date="createDate" />
            </div>
        </div>
    </div>
</template>

<script>
    import {DatePicker} from "v-calendar"
    import AppointmentCalendar from "./AppointmentCalendar.vue"
    import RequestList from "./RequestList.vue"
    import CreateAppmntRequest from "./CreateAppmntRequest.vue"
    export default {
        name: "Appointments",
        components: {
            AppointmentCalendar,
            DatePicker,
            RequestList,
            CreateAppmntRequest
        },
        data() {
            return {
                createDate: undefined,
            }
        },
        methods: {
            getAppointments () {
                this.$refs.reqList.getRequests()
                this.$refs.calendar.loadAppointments()
            },
        },
        mounted () {
            this.getAppointments()
        }
    }
</script>

<style>
    #app-vue {
        height: 100vh;
    }

    .top-row {
        height: 40vh;
    }
</style>