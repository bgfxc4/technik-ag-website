<template>
	<div id="type">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.params.category}/`'>{{ catName }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ typeName }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 g-4 m-3">
			<div v-for="item in itemList" :key="item.id" class="col">
				<div class="card mb-3 bg-secondary" style="padding: 10px">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-4 my-auto">
							<img @click="openItem(item.id, item.category, item.type)" role="button" v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + item.id" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; width: auto; height: auto; margin-left: 10px">
						</div>
    					<div class="col-8 my-auto">
							<div class="card-body">
								<h5 @click="openItem(item.id, item.category, item.type)" role="button" class="card-title">{{ item.name }}</h5>
								<div>
									<b>Description:</b> {{ item.description }} <br>
									<div v-for="f of Object.keys(item.custom_fields)" :key="f">
										<b>{{f}}:</b> {{ item.custom_fields[f] }} <br>
									</div>
									<b>Storage:</b> {{ item.room }} - {{ item.shelf }} - {{ item.compartment }}<br>
									<b>Amount:</b> {{item.amount}}<br>
									<b>ID:</b> {{ item.id }}
								</div>
								<button @click="openItem(item.id, item.category, item.type)" class="btn btn-outline-primary mt-2">Open Item</button>

								<a :id="'menu-popover-'+item.id" class="menu-popover" tabindex="0">
									<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
								</a>
								<b-popover :target="'menu-popover-'+item.id" triggers="focus">
									<button v-b-modal.deleteItemModal @click="deleteItemId = item.id" class="btn btn-danger" style="max-height: 6vh">
										<font-awesome-icon icon="trash-can"/> Delete Item
									</button><br>
									<button @click="editItem = item" v-b-modal.editItemModal class="btn btn-info" style="max-height: 6vh">
										<font-awesome-icon icon="pen"/> Edit Item
									</button>

									<ShowQrBarCode :toShow="item.id"></ShowQrBarCode>
								</b-popover>
							</div>
						</div>
					</div>
				</div>
			</div>
			<create-item :categoryId="catId" :typeId="typeId" @onCreate="loadItems"/>
		</div>
		<delete-item :itemId="deleteItemId" @onDelete="loadItems"/>
		<edit-item :item="editItem" @onEdit="loadItems"/>
	</div>
</template>

<script>
	import ShowQrBarCode from "../helpers/ShowQrBarCode.vue"	
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"
	import createItem from "./create/CreateItem.vue"
	import DeleteItem from './delete/DeleteItem.vue'
	import EditItem from './edit/EditItem.vue'

	export default {
		name: "Type",
		data () {
			return {
				itemList: [],
				catName: "",
				typeName: "",
				catId: "",
				typeId: "",
				errorText: "",
				isLoading: false,
				deleteItemId: "",
				editItem: {},
			}
		},
		components: {
			ErrorText,
			LoadingIcon,
			createItem,
			DeleteItem,
			EditItem,
			ShowQrBarCode
		},
		methods: {
			openItem(id) {
				this.$router.push(`/inventory/item/byId/${id}?category=${this.catId}&type=${this.typeId}`)
			},
			loadItems () {
				this.isLoading = true
				this.errorText = ""
				this.$store.dispatch("getItemsByType", {typeId: this.typeId}).then(answ => {
					this.isLoading = false
					console.log(answ)
					this.itemList = answ.res.data
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			},
            loadType () {
				this.$store.dispatch("getCategories").then(answ => {
					this.isLoading = false
				    let c = answ.data.find(cat => cat.id == this.catId)
                    this.catName = c.name
                    this.typeName = c.types.find(type => type.id == this.typeId).name

				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
            }
		},
		async created () {
			this.catId = this.$route.params.category
			this.typeId = this.$route.params.type
            this.loadType()
			this.loadItems()
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
