import axios from "axios"

const actions = {
	async getStorage({}, callback) {
        axios.get('storage/list').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },

    async createRoom({rootState}, params) {
        params['room'].login_hash = rootState.auth.loginHash
        axios.post("room/new", params['room']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createShelf({rootState}, params) {
        params['shelf'].login_hash = rootState.auth.loginHash
        axios.post("shelf/new", params['shelf']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createComp({rootState}, params) {
        params['comp'].login_hash = rootState.auth.loginHash
        axios.post("compartment/new", params['comp']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async deleteRoom({rootState}, params) {
        params['room'].login_hash = rootState.auth.loginHash
        axios.post("room/delete", params['room']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteShelf({rootState}, params) {
        params['shelf'].login_hash = rootState.auth.loginHash
        axios.post("shelf/delete", params['shelf']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteComp({rootState}, params) {
        params['comp'].login_hash = rootState.auth.loginHash
        axios.post("compartment/delete", params['comp']).then(res => {
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