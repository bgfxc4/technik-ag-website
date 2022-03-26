import axios from "axios"

const actions = {
	async getEquipment({}, callback) {
        axios.get('equipment/list').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getCategories({}, callback) {
        axios.get('categories/list').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getItemsByType({}, params) {
        axios.get(`equipment/bytype/${params["catName"]}/${params["typeName"]}`).then(res => {
            params["callback"](res, undefined, params["typeName"])
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async getItemByID({}, params) {
        axios.get(`equipment/byid/${params["itemID"]}`).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async getItemsBySearch({}, params) {
        axios.post("equipment/search", {keywords: params["keyword"]}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async createCategory({rootState}, params) {
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("category/new", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createType({rootState}, params) {
        params['type'].login_hash = rootState.auth.loginHash
        axios.post("type/new", params['type']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createItem({rootState}, params) {
        params['item'].login_hash = rootState.auth.loginHash
        axios.post("equipment/new", params['item']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async deleteCategory({rootState}, params) {
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("category/delete", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteType({rootState}, params) {
        params['type'].login_hash = rootState.auth.loginHash
        axios.post("type/delete", params['type']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteItem({rootState}, params) {
        params['item'].login_hash = rootState.auth.loginHash
        axios.post("equipment/delete", params['item']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async editCategory({rootState}, params) {
        params['category'].login_hash = rootState.auth.loginHash
        axios.post("category/edit", params['category']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editType({rootState}, params) {
        params['type'].login_hash = rootState.auth.loginHash
        axios.post("type/edit", params['type']).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editItem({rootState}, params) {
        params['item'].login_hash = rootState.auth.loginHash
        axios.post("equipment/edit", params['item']).then(res => {
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