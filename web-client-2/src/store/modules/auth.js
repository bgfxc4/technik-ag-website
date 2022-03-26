import axios from "axios"
import { sha512 } from "js-sha512"

const state = {
	loginHash: null
}

const getters = {
	isAuthenticated: state => !!state.loginHash,
	StateHash: state => state.loginHash
}

const actions = {
	async LogIn({commit}, User) {
		var hash = ("login_hash", sha512("technikag" + User.get('username') + ":" + User.get('password')))
        var headers = {'Authorization': hash}
		await axios.get('authorize', {headers})
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
