<template>
	<div id="storage-shelf">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/storage'>Storage</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/storage/${$route.params.room}/`'>{{ roomName }}</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/storage/${$route.params.room}/${$route.params.shelf}/`'>{{ shelfName }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ compName }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="item in itemList" :key="item.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-6 my-auto">
							<img @click="openItem(item.id)" role="button" v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + item.id" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; height: auto; margin-left: 10px">
						</div>
    					<div class="col-6 my-auto" style="max-height: 30vh">
							<div class="card-body" style="max-height: 30vh">
								<h5 @click="openItem(item.id)" role="button" class="card-title">{{ item.name }}</h5>
								<button @click="openItem(item.id)" class="btn btn-outline-primary mt-2">Open Item</button> <br>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from '../helpers/LoadingIcon.vue'

	export default {
		name: "StorageCompartment",
		components: {
			ErrorText,
			LoadingIcon,
		},
		data () {
			return {
				itemList: [],
				roomName: "",
				shelfName: "",
				compName: "",
				roomId: "",
				shelfId: "",
				compId: "",
				errorText: "",
				isLoading: false,
			}
		},
		methods: {
			openItem(id) {
				this.$router.push(`/inventory/item/byId/${id}`)
			},
			async loadItemList () {
				this.isLoading = true
				this.itemList = []
				this.$store.dispatch("getStorage").then(answ => {
					this.isLoading = false
                    let room = answ.data.find(el => el?.id == this.roomId)
					let shelfList = room.shelfs || []
                    let shelf = shelfList.find(el => el?.id == this.shelfId)
					let compList = shelf.compartments || []
                    let comp = compList.find(el => el?.id == this.compId)
					this.itemList = comp.items || []
                    this.roomName = room?.name
                    this.shelfName = shelf?.name
                    this.compName = comp?.name
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.roomId = this.$route.params.room
			this.shelfId = this.$route.params.shelf
			this.compId = this.$route.params.compartment
			this.loadItemList()
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
