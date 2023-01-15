import axios from "axios"

const actions = {
	async getChecklistList({rootState}) {
		var headers = {'Authorization': rootState.auth.loginHash}
		return await axios.get('tools/checklists/list', {headers}).then(res => {
			return res
		}).catch(err => {
			console.log(err)
			throw err
		})
	},
	async createChecklist({rootState}, request) {
		var headers = {'Authorization': rootState.auth.loginHash}
		return await axios.post('tools/checklists/new', request, {headers}).then(res => {
			return res
		}).catch(err => {
			console.log(err)
			throw err
		})
	},
	async deleteChecklist({rootState}, request) {
		var headers = {'Authorization': rootState.auth.loginHash}
		return await axios.post('tools/checklists/delete', request, {headers}).then(res => {
			return res
		}).catch(err => {
			console.log(err)
			throw err
		})
	},
	async checklistNewItems({rootState}, request) {
		var headers = {'Authorization': rootState.auth.loginHash}
		return await axios.post('tools/checklists/newItems', request, {headers}).then(res => {
			return res
		}).catch(err => {
			console.log(err)
			throw err
		})
	},
	async checklistDeleteItems({rootState}, request) {
		var headers = {'Authorization': rootState.auth.loginHash}
		return await axios.post('tools/checklists/deleteItems', request, {headers}).then(res => {
			return res
		}).catch(err => {
			console.log(err)
			throw err
		})
	},
	async checklistSetItemsChecked({rootState}, request) {
		var headers = {'Authorization': rootState.auth.loginHash}
		return await axios.post('tools/checklists/setItemsChecked', request, {headers}).then(res => {
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