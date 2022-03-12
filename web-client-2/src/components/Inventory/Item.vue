<template>
	<div id="item">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.params.category}/`'>{{ $route.params.category }}</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.params.category}/${$route.params.type}`'>{{ $route.params.category }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.type }}</li>
			</ol>
		</nav>
		<div class="row container m-3">
			<div class="col-5">
				<img v-if="item.id" v-bind:src="$store.state.apiUrl + '/get-item-img/' + item.id" class="card-img" 
									style="max-width: 30vw; max-height: 30vh; width: auto; height: auto; margin-left: 10px">
			</div>
			<div class="col-7">
				<h5 class="card-title">{{ item.name }}</h5>
				<p>
					<b>Description:</b> {{ item.description }} <br>
					<b>Storage:</b> {{ item.room }} - {{ item.shelf }} - {{ item.compartment }}<br>
					<b>ID:</b> {{ item.id }}
				</p>
				<ShowQrBarCode :toShow="item.id"></ShowQrBarCode>
			</div>
		</div>
	</div>
</template>

<script>
	import ShowQrBarCode from "../ShowQrBarCode.vue"	

	export default {
		name: "Item",
		components: {
			ShowQrBarCode
		},
		data () {
			return {
				item: {},
				catName: "",
				typeName: "",
				itemID: ""
			}
		},
		async created () {
			this.catName = this.$route.params.category
			this.typeName = this.$route.params.type
			this.itemID = this.$route.params.itemID
			this.$store.dispatch("getItemByID", {itemID: this.itemID, callback: answ => {
				if (!answ)
					return
				console.log(answ.data[0].equipment[0])
				this.item = answ.data[0].equipment[0]
			}})
		}
	}
</script>

<style>
</style>
