<template>
    <div style="position: relative; height: 100%">
        <div class="rounded-panel overflow-auto bg-secondary" :class="(!!errorText) ?  'blur' : ''">
            <h4>Requests:</h4>
            <loading-icon v-if="isLoading" size="3x"/>
            <div class="request-item bg-dark" v-for="r of list" :key="r.id">
                <b>Name:</b> {{r.name}}
                <b>Description:</b> {{r.description}} <br>
                <b>Contact:</b> {{r.contact}} <br>
                <template v-if="r.needed_items"><b>Needed Items:</b> {{r.needed_items}} <br></template>
                <b>Date:</b> {{new Date(r.date).toLocaleString('de-DE', dateOptions)}} - {{new Date(r.end_date).toLocaleString('de-DE', dateOptions)}}<br>
                <b-button class="btn btn-danger" v-b-modal.deleteRequestModal @click="selectedRequest = r.id"><font-awesome-icon icon="trash-can"/></b-button>
                <b-button class="btn btn-info mx-2" v-b-modal.approveRequestModal @click="selectedRequest = r.id"><font-awesome-icon icon="check"/></b-button>
            </div>
        </div>
        <error-text v-if="!!errorText" v-bind:msg="errorText" style="position: absolute; top: 20px; right: 50%; transform: translate(50%, 0%);"/>
    </div>

    <b-modal size="lg" id="deleteRequestModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Appointment Request" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            Do you really want to delete the appointment request?
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteRequestModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteRequest">Delete Request</button>
        </div>
    </b-modal>

    <b-modal size="lg" id="approveRequestModal" class="text-secondary" centered hide-footer hide-header-close title="Approve Appointment Request" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            Do you really want to approve the appointment request?
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.approveRequestModal>Cancel</b-button>
            <button class="btn btn-outline-info" @click="approveRequest">Approve Request</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../helpers/ErrorText.vue"
    import LoadingIcon from "../helpers/LoadingIcon.vue"
    export default {
        name: "RequestList",
        emits: ["update"],
        components: {
            ErrorText,
            LoadingIcon
        },
        data () {
            return {
                list: [],
                isLoading: false,
                errorText: "",
                selectedRequest: "", // used to cache the id of the appointment to delete/approve ...
                dateOptions: {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}
            }
        },
        methods: {
            closeDeleteModal() {
                $("#deleteRequestModal div #closeModalButton").click()
            },
            closeApproveModal() {
                $("#approveRequestModal div #closeModalButton").click()
            },
            deleteRequest() {                
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("deleteAppointmentRequest", {id: this.selectedRequest, from_google_calendar: this.list.find(el => el.id == this.selectedRequest).from_google_calendar}).then(_res => {
                    this.isLoading = false
                    this.$emit("update")
                    this.closeDeleteModal()
                }).catch(err => {
                this.isLoading = false
                    console.log(err)
                    this.errorText = err
                })
            },
            approveRequest() {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("approveAppointmentRequest", {id: this.selectedRequest, from_google_calendar: this.list.find(el => el.id == this.selectedRequest).from_google_calendar}).then(_res => {
                    this.isLoading = false
                    this.$emit("update")
                    this.closeApproveModal()
                }).catch(err => {
                this.isLoading = false
                    console.log(err)
                    this.errorText = err
                })
            },
            getRequests () {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("getRequestList").then(res => {
                    this.isLoading = false
                    this.list = res.data
                }).catch(err => {
                this.isLoading = false
                    console.log(err)
                    this.errorText = err
                })
            }
        }
    }
</script>

<style>
    .blur {
        filter: blur(5px)
    }

    .rounded-panel {
        border-radius: 8px;
        margin-top: 2rem;
        height: calc(100% - 2rem);
    }
    .rounded-panel h4{
        margin-left: 4%
    }

    .request-item {
        border-radius: 6px;
        margin: 5px;
        padding: 5px;
    }
</style>