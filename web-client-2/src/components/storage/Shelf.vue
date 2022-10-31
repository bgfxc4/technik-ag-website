<template>
	<div id="storage-shelf">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/storage'>Storage</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/storage/${$route.params.room}/`'>{{ $route.params.room }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.shelf }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="comp in compList" :key="comp.name" class="col">
				<div class="card mb-3 bg-secondary" style="height: 16vh">
						<div class="row g-0" style="height: 100%">
						<div class="card-body" style="max-height: 30vh">
							<h5 @click="openComp(comp.name)" role="button" class="card-title">{{ comp.name }}</h5>
							<div style="max-height: 15vh; overflow: hidden;">
								<router-link v-for="i in comp.items" :key="i.id" :to="`/inventory/item/byId/${i.id}`" 
									class="fs-6 text-break d-block text-truncate">{{ i.name }}</router-link>
							</div>
							<button @click="openComp(comp.name)" class="btn btn-outline-primary mt-2">Open Compartment</button> <br>

							<a :id="'menu-popover-'+comp.name" class="menu-popover" tabindex="0">
								<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
							</a>
							<b-popover :target="'menu-popover-'+comp.name" triggers="focus">
								<button v-b-modal.deleteCompModal @click="deleteCompName = comp.name" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/> Delete Compartment
								</button>
								<button @click="editCompName = comp.name" v-b-modal.editCompModal class="btn btn-info" style="max-height: 6vh">
									<font-awesome-icon icon="pen"/> Edit Compartment
								</button>
							</b-popover>
						</div>
					</div>
				</div>
			</div>
			<create-compartment :room="roomName" :shelf="shelfName" @onCreate="loadShelfList" />
		</div>

		<delete-compartment :room="roomName" :shelf="shelfName" :comp="deleteCompName" @onDelete="loadShelfList" />
		<edit-comp :room="roomName" :shelf="shelfName" :comp="editCompName" @onEdit="loadShelfList" />
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from '../helpers/LoadingIcon.vue'
	import CreateCompartment from "./create/CreateCompartment.vue"
	import DeleteCompartment from './delete/DeleteCompartment.vue'
	import EditComp from './edit/EditComp.vue'

	export default {
		name: "StorageShelf",
		components: {
			ErrorText,
			CreateCompartment,
			LoadingIcon,
			DeleteCompartment,
			EditComp,
		},
		data () {
			return {
				compList: [],
				roomName: "",
				shelfName: "",
				errorText: "",
				isLoading: false,
				deleteCompName: undefined,
				editCompName: undefined
			}
		},
		methods: {
			openComp(name) {
				this.$router.push(`/storage/${this.roomName}/${this.shelfName}/${name}/`)
			},
			async loadShelfList () {
				this.isLoading = true
				this.compList = []
				this.$store.dispatch("getStorage").then(answ => {
					this.isLoading = false
					console.log(answ.data.find(el => el?.name == this.roomName))
					let shelfList = answ.data.find(el => el?.name == this.roomName).shelfs || []
					this.compList = shelfList.find(el => el?.name == this.shelfName).compartments || []
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.roomName = this.$route.params.room
			this.shelfName = this.$route.params.shelf
			this.loadShelfList()
		}
	}
</script>

<style>
.menu-popover {
	position: absolute;
	top: 8px;
	right: 8px;
	border: none;
	color: var(--bt-white)
}

.menu-popover:hover {
	border: none;
	color: var(--bt-white)
}
</style>
