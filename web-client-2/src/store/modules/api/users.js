import axios from "axios"

const actions = {
	async getUsers({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get('users/list', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post('users/new', user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post('users/delete', user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editPermUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("users/permedit", user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("users/edit", user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    }
}

export default {
	actions
}