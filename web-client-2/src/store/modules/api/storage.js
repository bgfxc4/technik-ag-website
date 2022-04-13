import axios from "axios"

const actions = {
	async getStorage({rootState}, callback) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get('storage/list', {headers}).then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },

    async createRoom({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("room/new", params['room'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createShelf({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("shelf/new", params['shelf'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createComp({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("compartment/new", params['comp'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async deleteRoom({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("room/delete", params['room'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteShelf({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("shelf/delete", params['shelf'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteComp({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("compartment/delete", params['comp'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async editRoom({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("room/edit", params['room'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editShelf({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("shelf/edit", params['shelf'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editComp({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("compartment/edit", params['comp'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
}

export default {
	actions
}