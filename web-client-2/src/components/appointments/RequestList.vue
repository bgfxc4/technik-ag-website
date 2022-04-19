<template>
    <div class="rounded-panel overflow-auto bg-secondary">
        <h4>Requests:</h4>
        <loading-icon v-if="isLoading" size="3x"/>
        <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
        <div class="request-item bg-dark" v-for="r of list" :key="r.id">
            <b>Name:</b> {{r.name}}
            <b>Description:</b> {{r.description}} <br>
            <b>Date:</b> {{new Date(r.date).toLocaleDateString('de-DE', dateOptions)}} - {{new Date(r.end_date).toLocaleDateString('de-DE', dateOptions)}}<br>
            <b-button class="btn btn-danger" v-b-modal.deleteRequestModal @click="selectedRequest = r.id"><font-awesome-icon icon="trash-can"/></b-button>
            <b-button class="btn btn-info mx-2" v-b-modal.approveRequestModal @click="selectedRequest = r.id"><font-awesome-icon icon="check"/></b-button>
        </div>
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
                dateOptions: {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric'}
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
                this.$store.dispatch("deleteAppointmentRequest", {id: this.selectedRequest}).then(res => {
                    this.isLoading = false
                    this.list = res.data
                }).catch(err => {
                this.isLoading = false
                    console.log(err)
                    this.errorText = err
                })
                this.$emit("update")
                this.closeDeleteModal()
            },
            approveRequest() {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("approveAppointmentRequest", {id: this.selectedRequest}).then(res => {
                    this.isLoading = false
                    this.list = res.data
                }).catch(err => {
                this.isLoading = false
                    console.log(err)
                    this.errorText = err
                })
                this.$emit("update")
                this.closeApproveModal()
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