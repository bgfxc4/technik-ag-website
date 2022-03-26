import axios from "axios"

const actions = {
	async getUsers({rootState}, callback) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post('users/list', {headers}).then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
}

export default {
	actions
}