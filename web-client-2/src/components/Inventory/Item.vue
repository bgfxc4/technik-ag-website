<template>
	<div id="item">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb" v-if="catName && typeName">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.query.category}/`'>{{ $route.query.category }}</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.query.category}/${$route.query.type}`'>{{ $route.query.type }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.itemID }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row container m-3">
			<div class="col-5">
				<img v-if="item.id" v-bind:src="$store.state.apiUrl + '/get-item-img/' + item.id" class="card-img" 
									style="max-width: 30vw; max-height: 30vh; width: auto; height: auto; margin-left: 10px">
			</div>
			<div class="col-7">
				<h5 class="card-title">{{ item.name }}</h5>
				<div>
					<b>Description:</b> {{ item.description }} <br>
					<div v-if="item.custom_fields">
						<div v-for="f of Object.keys(item.custom_fields)" :key="f">
							<b>{{f}}:</b> {{ item.custom_fields[f] }} <br>
						</div>
					</div>
					<b>Storage:</b> {{ item.room }} - {{ item.shelf }} - {{ item.compartment }}<br>
					<b>ID:</b> {{ item.id }}
				</div>
				<ShowQrBarCode :toShow="item.id"></ShowQrBarCode>
				<button v-b-modal.deleteItemModal class="btn btn-danger" style="max-height: 6vh">
					<font-awesome-icon icon="trash-can"/>
				</button>
			</div>
		</div>
		<delete-item :categoryName="item.category" :typeName="item.type" :itemId="item.id" @onDelete="itemDeleted"/>
	</div>
</template>

<script>
	import ShowQrBarCode from "../helpers/ShowQrBarCode.vue"	
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"
	import DeleteItem from './delete/DeleteItem.vue'

	export default {
		name: "Item",
		components: {
			ShowQrBarCode,
			ErrorText,
			LoadingIcon,
			DeleteItem
		},
		data () {
			return {
				item: {},
				catName: "",
				typeName: "",
				itemID: "",
				deleteItemId: "",
				errorText: "",
				isLoading: false
			}
		},
		methods: {
			itemDeleted () {
				this.$router.push(`/inventory/${this.item.category}/${this.item.type}`)
			}
		},
		async created () {
			this.catName = this.$route.query.category
			this.typeName = this.$route.query.type
			this.itemID = this.$route.params.itemID
			this.isLoading = true
			this.$store.dispatch("getItemByID", {itemID: this.itemID, callback: (answ, err) => {
				this.isLoading = false
				if (!answ) {
					this.errorText = err
					return
				}
				console.log(answ.data[0].equipment[0])
				this.item = answ.data[0].equipment[0]
			}})
		}
	}
</script>

<style>
</style>
