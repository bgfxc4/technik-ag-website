import axios from "axios"

const actions = {
	async getUsers({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('users/list', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('users/new', user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('users/delete', user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editPermUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("users/permedit", user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editUser({rootState}, user) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("users/edit", user, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getGroups({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('groups/list', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createGroup({rootState}, group) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('groups/new', group, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteGroup({rootState}, group) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('groups/delete', group, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editGroup({rootState}, group) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("groups/edit", group, {headers}).then(res => {
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