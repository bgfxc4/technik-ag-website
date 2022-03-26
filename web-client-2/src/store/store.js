import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"
import auth from './modules/auth'
import inventoryApi from "./modules/api/inventory"
import storageApi from "./modules/api/storage"
import usersApi from "./modules/api/users"

export const store = createStore({
	modules: {
		auth,
		inventoryApi,
		storageApi,
		usersApi
	},
	state: {
		isLoading: false,
		apiUrl: process.env.VUE_APP_ApiServerUrl
	},
	plugins: [createPersistedState({ paths: ['auth'] })]
})
