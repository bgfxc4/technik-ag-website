import axios from "axios"

const actions = {
	async getUsers({rootState}, callback) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get('users/list', {headers}).then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async createUser({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post('users/new', params["user"], {headers}).then(res => {
            params['callback'](res)
        }).catch(err => {
            console.log(err)
            params['callback'](undefined, err)
        })
    },
    async deleteUser({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post('users/delete', params["user"], {headers}).then(res => {
            params['callback'](res)
        }).catch(err => {
            console.log(err)
            params['callback'](undefined, err)
        })
    },
    async editPermUser({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("users/permedit", params["user"], {headers}).then(res => {
            params['callback'](res)
        }).catch(err => {
            console.log(err)
            params['callback'](undefined, err)
        })
    }
}

export default {
	actions
}