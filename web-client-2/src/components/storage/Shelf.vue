<template>
	<div id="storage-shelf">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/storage'>Storage</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/storage/${$route.params.room}/`'>{{ roomName }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ shelfName }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="comp in compList" :key="comp.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 16vh">
						<div class="row g-0" style="height: 100%">
						<div class="card-body" style="max-height: 30vh">
							<h5 @click="openComp(comp.id)" role="button" class="card-title">{{ comp.name }}</h5>
							<div style="max-height: 15vh; overflow: hidden;">
								<router-link v-for="i in comp.items" :key="i.id" :to="`/inventory/item/byId/${i.id}`" 
									class="fs-6 text-break d-block text-truncate">{{ i.name }}</router-link>
							</div>
							<button @click="openComp(comp.id)" class="btn btn-outline-primary mt-2">Open Compartment</button> <br>

							<a :id="'menu-popover-'+comp.id" class="menu-popover" tabindex="0">
								<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
							</a>
							<b-popover :target="'menu-popover-'+comp.id" triggers="focus">
								<button v-b-modal.deleteCompModal @click="deleteCompId = comp.id" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/> Delete Compartment
								</button>
								<button @click="editCompId = comp.id" v-b-modal.editCompModal class="btn btn-info" style="max-height: 6vh">
									<font-awesome-icon icon="pen"/> Edit Compartment
								</button>
							</b-popover>
						</div>
					</div>
				</div>
			</div>
			<create-compartment :room="roomName" :shelf="shelfName" @onCreate="loadShelfList" />
		</div>

		<delete-compartment :comp="deleteCompId" @onDelete="loadShelfList" />
		<edit-comp :comp="editCompId" @onEdit="loadShelfList" />
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
				roomId: "",
				shelfId: "",
				errorText: "",
				isLoading: false,
				deleteCompId: undefined,
				editCompId: undefined
			}
		},
		methods: {
			openComp(id) {
				this.$router.push(`/storage/${this.roomId}/${this.shelfId}/${id}/`)
			},
			async loadShelfList () {
				this.isLoading = true
				this.compList = []
				this.$store.dispatch("getStorage").then(answ => {
					this.isLoading = false
                    let room = answ.data.find(el => el?.id == this.roomId)
                    this.roomName = room?.name
					let shelfList = room.shelfs || []
                    let shelf = shelfList.find(el => el?.id == this.shelfId)
                    this.shelfName = shelf?.name
					this.compList = shelf.compartments || []
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.roomId = this.$route.params.room
			this.shelfId = this.$route.params.shelf
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
