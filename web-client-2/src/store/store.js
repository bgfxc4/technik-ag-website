import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate"
import auth from './modules/auth'
import inventoryApi from "./modules/api/inventory"
import storageApi from "./modules/api/storage"
import usersApi from "./modules/api/users"
import appointmentApi from "./modules/api/appointments"
import toolsApi from "./modules/api/tools"

export const store = createStore({
	modules: {
		auth,
		inventoryApi,
		storageApi,
		usersApi,
		appointmentApi,
		toolsApi
	},
	state: {
		isLoading: false,
		apiUrl: import.meta.env.VITE_APP_APISERVERURL
	},
	plugins: [createPersistedState({ paths: ['auth'] })]
})
