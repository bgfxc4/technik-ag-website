import { createApp } from 'vue'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import jQuery from 'jquery'
import axios from "axios"

axios.defaults.baseURL = process.env.VUE_APP_ApiServerUrl

import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
library.add(fas, far)

import { store } from './store/store'
import App from './App.vue'
import { router } from "./router"

// Import Bootstrap an BootstrapVue CSS files (order is important)
//import 'bootstrap/dist/css/bootstrap.css'
import './assets/css/bootstrap.min.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
window.$ = jQuery

import "./assets/css/general.css"

import { SetupCalendar } from 'v-calendar';
import 'v-calendar/dist/style.css';

// Make BootstrapVue available throughout your project

var app = createApp(App)

app.use(router)
app.use(store)
app.use(BootstrapVue3)

app.use(SetupCalendar, {})
app.component("font-awesome-icon", FontAwesomeIcon)

app.mount('#app')
