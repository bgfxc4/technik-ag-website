<template>
    <b-modal size="lg" id="appmntInfoModal" class="text-secondary" centered hide-footer hide-header-close title="Appointment Info" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <b>Name:</b> {{appointment.name}} <br>
            <b>Description:</b> {{appointment.description}} <br>
            <b>Contact:</b> {{appointment.contact}} <br>
            <template v-if="appointment.needed_items"><b>Needed Items:</b> {{appointment.needed_items}} <br></template>
            <b>Date:</b> {{new Date(appointment.date).toLocaleString('de-DE', dateOptions)}} - {{new Date(appointment.end_date).toLocaleString('de-DE', dateOptions)}}<br>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
            <button id="closeModalButton" class="btn btn-outline-primary" v-b-modal.appmntInfoModal>Close</button>
            <button class="btn btn-danger mx-2" v-b-modal.deleteAppmntModal>Delete</button>
        </div>
    </b-modal>
    <b-modal size="lg" id="deleteAppmntModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Appointment" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            Do you really want to delete the appointment?
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <b-button id="closeModalButton" class="btn btn-secondary mx-2" v-b-modal.deleteAppmntModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteAppmnt">Delete Appointment</button>
        </div>
    </b-modal>
</template>

<script>
    import ErrorText from "../helpers/ErrorText.vue"
    import LoadingIcon from "../helpers/LoadingIcon.vue"

    export default {
        name: "AppmntInfo",
        emits: ['onChange'],
        components: {
            ErrorText,
            LoadingIcon
        },
        props: {
            appointment: Object
        },
        data: function () {
            return  {
                errorText: "",
                isLoading: false,
                dateOptions: {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'}
            }
        },
        methods: {
            closeDeleteModal () {
                $("#deleteAppmntModal div #closeModalButton").click()
            },
            closeModal () {
                $('#appmntInfoModal div #closeModalButton').click()
            },
            deleteAppmnt () {
                this.isLoading = true
                this.errorText = ""
                this.$store.dispatch("deleteAppointment", {id: this.appointment.id}).then(_ => {
                    this.isLoading = false
                    this.$emit("onChange")
                    this.closeDeleteModal()
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

</style>