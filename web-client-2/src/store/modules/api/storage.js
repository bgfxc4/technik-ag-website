import axios from "axios"

const actions = {
	async getStorage({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('storage/list', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },

    async createRoom({rootState}, room) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("room/new", room, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createShelf({rootState}, shelf) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("shelf/new", shelf, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createComp({rootState}, comp) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("compartment/new", comp, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },

    async deleteRoom({rootState}, room) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("room/delete", room, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteShelf({rootState}, shelf) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("shelf/delete", shelf, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteComp({rootState}, comp) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("compartment/delete", comp, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },

    async editRoom({rootState}, room) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("room/edit", room, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editShelf({rootState}, shelf) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("shelf/edit", shelf, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editComp({rootState}, comp) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("compartment/edit", comp, {headers}).then(res => {
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