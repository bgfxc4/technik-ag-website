<template>
	<div id="storage-shelf">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/storage'>Storage</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/storage/${$route.params.room}/`'>{{ $route.params.room }}</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/storage/${$route.params.room}/${$route.params.shelf}/`'>{{ $route.params.shelf }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.compartment }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="item in itemList" :key="item.name" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-6 my-auto">
							<img @click="openItem(item.id, item.category, item.type)" role="button" v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + item.id" class="card-img" 
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
					console.log(answ.data.find(el => el?.name == this.roomName))
					let shelfList = answ.data.find(el => el?.name == this.roomName).shelfs || []
					let compList = shelfList.find(el => el?.name == this.shelfName).compartments || []
					this.itemList = compList.find(el => el?.name == this.compName).items || []
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.roomName = this.$route.params.room
			this.shelfName = this.$route.params.shelf
			this.compName = this.$route.params.compartment
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
