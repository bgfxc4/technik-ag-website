import axios from "axios"

const actions = {
	async getEquipment({}, callback) {
        axios.get('get-equipment').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getCategories({}, callback) {
        axios.get('get-categories').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getItemsByType({}, params) {
        axios.get(`get-equipment-by-type/${params["catName"]}/${params["typeName"]}`).then(res => {
            params["callback"](res, undefined, params["typeName"])
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async getItemByID({}, params) {
        axios.get(`get-equipment-by-id/${params["itemID"]}`).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async getItemsBySearch({}, params) {
        axios.post("search-equipment", {keywords: params["keyword"]}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async createCategory({rootState}, params) {
        console.log(rootState.auth.loginHash)
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("new-category", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    }
}

export default {
	actions
}