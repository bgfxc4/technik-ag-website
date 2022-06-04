import axios from "axios"

const actions = {
	async getEquipment({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('equipment/list', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getEquipmentDuringAppointment({rootState}, appointment) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('equipment/list/duringappointment', appointment, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getOneEquipmentDuringAppointment({rootState}, appointment) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post('equipment/get/duringappointment', appointment, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getCategories({rootState}) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get('categories/list', {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getItemsByType({rootState}, params) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get(`equipment/bytype/${params["catName"]}/${params["typeName"]}`, {headers}).then(res => {
            return {res, typeName: params["typeName"]}
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getItemByID({rootState}, itemID) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.get(`equipment/byid/${itemID}`, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async getItemsBySearch({rootState}, keyword) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("equipment/search", {keywords: keyword}, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },

    async createCategory({rootState}, category) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("category/new", category, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createType({rootState}, type) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("type/new", type, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async createItem({rootState}, item) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("equipment/new", item, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },

    async deleteCategory({rootState}, category) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("category/delete", category, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteType({rootState}, type) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("type/delete", type, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async deleteItem({rootState}, item) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("equipment/delete", item, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },

    async editCategory({rootState}, category) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("category/edit", category, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editType({rootState}, type) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("type/edit", type, {headers}).then(res => {
            return res
        }).catch(err => {
            console.log(err)
            throw err
        })
    },
    async editItem({rootState}, item) {
        var headers = {'Authorization': rootState.auth.loginHash}
        return await axios.post("equipment/edit", item, {headers}).then(res => {
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