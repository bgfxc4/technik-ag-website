<template>
	<div id="type">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.params.category}/`'>{{ $route.params.category }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.type }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 g-4 m-3">
			<div v-for="item in itemList" :key="item.id" class="col">
				<div class="card mb-3 bg-secondary" style="padding: 10px">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-4 my-auto">
							<img v-bind:src="$store.state.apiUrl + '/get-item-img/' + item.id" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; width: auto; height: auto; margin-left: 10px">
						</div>
    					<div class="col-8 my-auto">
							<div class="card-body">
								<h5 class="card-title">{{ item.name }}</h5>
								<div>
									<b>Description:</b> {{ item.description }} <br>
									<div v-if="item.custom_fields.length">
										<div v-for="f of Object.keys(item.custom_fields)" :key="f">
											<b>{{f}}:</b> {{ item.custom_fields[f] }} <br>
										</div>
									</div>
									<b>Storage:</b> {{ item.room }} - {{ item.shelf }} - {{ item.compartment }}<br>
									<b>ID:</b> {{ item.id }}
								</div>
								<router-link :to="`/inventory/item/byId/${item.id}?category=${item.category}&type=${item.type}`" class="btn btn-outline-primary mt-2">Open Item</router-link>
								<br>
    							<button v-b-modal.deleteItemModal @click="deleteItemId = item.id" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<create-item :categoryName="catName" :typeName="typeName" @onCreate="loadItems"/>
		</div>
		<delete-item :categoryName="catName" :typeName="typeName" :itemId="deleteItemId" @onDelete="loadItems"/>
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"
	import createItem from "./create/CreateItem.vue"
	import DeleteItem from './delete/DeleteItem.vue'

	export default {
		name: "Type",
		data () {
			return {
				itemList: [],
				catName: "",
				typeName: "",
				errorText: "",
				isLoading: false,
				deleteItemId: ""
			}
		},
		components: {
			ErrorText,
			LoadingIcon,
			createItem,
			DeleteItem
		},
		methods: {
			loadItems () {
				this.isLoading = true
				this.$store.dispatch("getItemsByType", {catName: this.catName, typeName: this.typeName, callback: (answ, err, _t) => {
					this.isLoading = false
					if (!answ) {
						this.errorText = err
						return
					}
					this.itemList = answ.data
				}})
			}
		},
		async created () {
			this.catName = this.$route.params.category
			this.typeName = this.$route.params.type
			this.loadItems()
		}
	}
</script>

<style>
</style>
