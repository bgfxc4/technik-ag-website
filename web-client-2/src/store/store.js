import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"
import auth from './modules/auth'
import inventoryApi from "./modules/api/inventory"

export const store = createStore({
	modules: {
		auth,
		inventoryApi
	},
	state: {
		isLoading: false,
		apiUrl: process.env.VUE_APP_ApiServerUrl
	},
	plugins: [createPersistedState()]
})
