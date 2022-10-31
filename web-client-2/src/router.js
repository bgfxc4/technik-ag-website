import { createRouter, createWebHistory } from "vue-router"

import { store } from "./store/store"

import Login from "./components/Login.vue"
import Home from "./components/Home.vue"

import Inventory from "./components/Inventory/Inventory.vue"
import Category from "./components/Inventory/Category.vue"
import Type from "./components/Inventory/Type.vue"
import Item from "./components/Inventory/Item.vue"
import Search from "./components/Inventory/Search.vue"
import Storage from "./components/storage/Storage.vue"
import Room from "./components/storage/Room.vue"
import Shelf from "./components/storage/Shelf.vue"
import Compartment from "./components/storage/Compartment.vue"

import Appointments from "./components/appointments/Appointments.vue"
import Scan from "./components/Scan.vue"

import SettingsPanel from "./components/settings/SettingsPanel.vue"

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/login",
		name: "Login",
		component: Login
	},
	{
		path: "/inventory",
		name: "Inventory",
		component: Inventory
	},
	{
		path: "/inventory/:category",
		name: "InventoryCategory",
		component: Category
	},
	{
		path: "/inventory/:category/:type",
		name: "InventoryType",
		component: Type
	},	
	{
		path: "/inventory/item/byId/:itemID",
		name: "InventoryItem",
		component: Item
	},
	{
		path: "/search/:keyword",
		name: "Search",
		component: Search
	},
	{
		path: "/storage",
		name: "Storage",
		component: Storage
	},
	{
		path: "/storage/:room",
		name: "StorageRoom",
		component: Room
	},
	{
		path: "/storage/:room/:shelf",
		name: "StorageShelf",
		component: Shelf
	},
	{
		path: "/storage/:room/:shelf/:compartment",
		name: "StorageCompartment",
		component: Compartment
	},
	{
		path: "/scan",
		name: "Scan",
		component: Scan
	},
	{
		path: "/appointments",
		name: "Appointments",
		component: Appointments
	},
	{
		path: "/settings",
		name: "SettingsPanel",
		component: SettingsPanel
	}
]

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (store.getters.isAuthenticated) {
			next()
			return
		}
		next('/login')
	} else {
		next()
	}
})
