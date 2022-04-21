import axios from "axios"

const actions = {
	async getRequestList({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('appointments/list/requested', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getAppointmentList({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('appointments/list/approved', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async requestAppointment({rootState}, request) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('appointments/request', request, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteAppointmentRequest({rootState}, request) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('appointments/delete/request', request, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteAppointment({rootState}, request) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('appointments/delete/approved', request, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async approveAppointmentRequest({rootState}, request) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('appointments/approve', request, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
}

export default {
	actions
}