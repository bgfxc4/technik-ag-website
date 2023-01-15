<template>
    <div no-body id="appointments" class="container">
        <b-tabs card>
            <b-tab title="Appointments">
                <b-card-title>All approved appointments:</b-card-title>
                <b-card-text>
                    <appointment-calendar @update="getAppointments" ref="calendar" />
                </b-card-text>
            </b-tab>
            <b-tab title="Requests">
                <b-card-title>All requests for appointments:</b-card-title>
                <b-card-text>
                    <request-list @update="getAppointments" ref="reqList"/>
                </b-card-text>
            </b-tab>
            <b-tab title="Create Request">
                <b-card-title>Select a date to request an appointment:</b-card-title>
                <b-card-text>
                    <date-picker :min-date='new Date()' :first-day-of-week="2" class="col-4" v-model="createDate" mode="dateTime" :model-config="{type: 'number'}" is24hr is-expanded/>
                    <create-appmnt-request @onCreate="getAppointments" v-show="createDate" :date="createDate" />
                </b-card-text>
            </b-tab>
        </b-tabs>
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
            if (this.$route.hash) {
                this.$refs.calendar.openAppmntInfoModal(this.$route.hash)
            }
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