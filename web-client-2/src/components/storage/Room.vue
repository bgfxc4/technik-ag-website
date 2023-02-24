<template>
	<div id="storage-room">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/storage'>Storage</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ roomName }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="shelf in shelfList" :key="shelf.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 16vh">
						<div class="row g-0" style="height: 100%">
						<div class="card-body" style="max-height: 30vh">
							<h5 @click="openShelf(shelf.id)" role="button" class="card-title">{{ shelf.name }}</h5>
							<div style="max-height: 15vh; overflow: hidden;">
								<router-link v-for="t in shelf.compartments" :key="t" :to="`/storage/${roomId}/${shelf.id}/${t.id}`" 
									class="fs-6 text-break d-block text-truncate">{{ t.name }}</router-link>
							</div>
							<button @click="openShelf(shelf.id)" class="btn btn-outline-primary mt-2">Open Shelf</button> <br>

							<a :id="'menu-popover-'+shelf.id" class="menu-popover" tabindex="0">
								<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
							</a>
							<b-popover :target="'menu-popover-'+shelf.id" triggers="focus">
								<button v-b-modal.deleteShelfModal @click="deleteShelfId = shelf.id" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/> Delete Shelf
								</button>
								<button @click="editShelfId = shelf.id" v-b-modal.editShelfModal class="btn btn-info" style="max-height: 6vh">
									<font-awesome-icon icon="pen"/> Edit Shelf
								</button>
							</b-popover>
						</div>
					</div>
				</div>
			</div>
			<create-shelf :room="roomName" @onCreate="loadShelfList" />
		</div>

		<delete-shelf :shelf="deleteShelfId" @onDelete="loadShelfList" />
		<edit-shelf :shelf="editShelfId" @onEdit="loadShelfList" />
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from '../helpers/LoadingIcon.vue'
	import CreateShelf from "./create/CreateShelf.vue"
	import DeleteShelf from './delete/DeleteShelf.vue'
	import EditShelf from './edit/EditShelf.vue'

	export default {
		name: "StorageRoom",
		components: {
			ErrorText,
			CreateShelf,
			LoadingIcon,
			DeleteShelf,
			EditShelf,
		},
		data () {
			return {
				shelfList: [],
				roomId: "",
                roomName: "",
				errorText: "",
				isLoading: false,
				deleteShelfId: undefined,
				editShelfId: undefined
			}
		},
		methods: {
			openShelf(id) {
				this.$router.push(`/storage/${this.roomId}/${id}/`)
			},
			async loadShelfList () {
				this.isLoading = true
				this.shelfList = []
				this.$store.dispatch("getStorage").then(answ => {
					this.isLoading = false
                    let room = answ.data.find(el => el?.id == this.roomId)
					this.shelfList = room?.shelfs || []
                    this.roomName = room?.name
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.roomId = this.$route.params.room
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
