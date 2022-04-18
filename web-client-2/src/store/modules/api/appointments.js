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
    async requestAppointment({rootState}, request) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('appointments/request', request, {headers}).then(res => {
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