import axios from "axios"

const actions = {
	async getEquipment({commit}, callback) {
        axios.get('get-equipment').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getCategories({commit}, callback) {
        axios.get('get-categories').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getItemsByType({commit}, params) {
        axios.get(`get-equipment-by-type/${params["catName"]}/${params["typeName"]}`).then(res => {
            params["callback"](res, undefined, params["typeName"])
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    }
}

export default {
	actions
}