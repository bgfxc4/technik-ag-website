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
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("new-category", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createType({rootState}, params) {
        params['type'].login_hash = rootState.auth.loginHash
        axios.post("new-type", params['type']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createItem({rootState}, params) {
        params['item'].login_hash = rootState.auth.loginHash
        axios.post("new-equipment", params['item']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async deleteCategory({rootState}, params) {
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("delete-category", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteType({rootState}, params) {
        params['type'].login_hash = rootState.auth.loginHash
        axios.post("delete-type", params['type']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteItem({rootState}, params) {
        params['item'].login_hash = rootState.auth.loginHash
        axios.post("delete-equipment", params['item']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async editCategory({rootState}, params) {
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("edit-category", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editType({rootState}, params) {
        params['type'].login_hash = rootState.auth.loginHash
        axios.post("edit-type", params['type']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editItem({rootState}, params) {
        params['item'].login_hash = rootState.auth.loginHash
        axios.post("edit-equipment", params['item']).then(res => {
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