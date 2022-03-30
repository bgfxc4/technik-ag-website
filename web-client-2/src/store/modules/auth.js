import axios from "axios"
import { sha512 } from "js-sha512"

const state = {
	loginHash: null,
	displayName: null,
	permissions: 0
}

const getters = {
	isAuthenticated: state => !!state.loginHash,
	StateHash: state => state.loginHash,
	StateDisplayName: state => state.displayName,
	StatePermissions: state => state.permissions
}

const actions = {
	async LogIn({commit}, User) {
		var hash = ("login_hash", sha512("technikag" + User.get('username') + ":" + User.get('password')))
        var headers = {'Authorization': hash}
		var auth = await axios.get('authorize', {headers})
		await commit("setPermissions", auth.data.permissions)
		await commit("setDisplayName", auth.data.display_name)
		await commit("setHash", hash)
	},
	async LogOut({commit}) {
		let hash = null
		commit('LogOut', hash)
	}
}

const mutations = {
	setHash(state, hash) {
		state.loginHash = hash
	},	
	setPermissions(state, perm) {
		state.permissions = perm
	},	
	setDisplayName(state, name) {
		state.displayName = name
	},
	LogOut(state) {
		state.loginHash = null
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}
