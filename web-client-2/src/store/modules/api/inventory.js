import axios from "axios"

const actions = {
	async getEquipment({rootState}, callback) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get('equipment/list', {headers}).then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getCategories({rootState}, callback) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get('categories/list', {headers}).then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
    async getItemsByType({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get(`equipment/bytype/${params["catName"]}/${params["typeName"]}`, {headers}).then(res => {
            params["callback"](res, undefined, params["typeName"])
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async getItemByID({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.get(`equipment/byid/${params["itemID"]}`, {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async getItemsBySearch({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("equipment/search", {keywords: params["keyword"]}, {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async createCategory({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("category/new", params['category'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createType({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("type/new", params['type'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async createItem({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("equipment/new", params['item'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async deleteCategory({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("category/delete", params['category'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteType({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("type/delete", params['type'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async deleteItem({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("equipment/delete", params['item'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },

    async editCategory({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("category/edit", params['category'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editType({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("type/edit", params['type'], {headers}).then(res => {
            params["callback"](res, undefined)
        }).catch(err => {
            console.log(err)
            params["callback"](undefined, err)
        })
    },
    async editItem({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        axios.post("equipment/edit", params['item'], {headers}).then(res => {
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