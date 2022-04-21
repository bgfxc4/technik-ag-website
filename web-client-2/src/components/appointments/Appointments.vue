<template>
    <div id="appointments" class="container">
        <div class="row mt-4 top-row">
            <div class="col-6">
                <h4>Appointments:</h4>
                <appointment-calendar @update="getAppointments" ref="calendar" />
            </div>
            <div class="col-2"/>
            <div class="col-4 h-100">
                <request-list @update="getAppointments" ref="reqList"/>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-3">
                <h5>Select a date to request an appointment:</h5>
                <date-picker :min-date='new Date()' :first-day-of-week="2" class="col-4" v-model="createDate" :model-config="{type: 'number'}"/>
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