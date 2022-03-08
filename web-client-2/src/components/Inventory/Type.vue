<template>
	<div id="type">
		<div class="row row-cols-1 g-4 m-3">

			<div v-for="item in itemList" :key="item.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-4 my-auto">
							<img v-bind:src="$store.state.apiUrl + '/get-item-img/' + item.id" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; width: auto; height: auto; margin-left: 10px">
						</div>
    					<div class="col-8 my-auto">
							<div class="card-body">
								<h5 class="card-title">{{ item.name }}</h5>
								<p>
									<b>Description:</b> {{ item.description }} <br>
									<b>Storage:</b> {{ item.room }} - {{ item.shelf }} - {{ item.compartment }}<br>
									<b>ID:</b> {{ item.id }}
								</p>
								<router-link :to="`/inventory/${catName}/${typeName}/${item.id}`" class="btn btn-outline-primary mt-2">Open Item</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	export default {
		name: "Type",
		data () {
			return {
				itemList: [],
				catName: "",
				typeName: "",
			}
		},
		async created () {
			this.catName = this.$route.params.category
			this.typeName = this.$route.params.type
			this.$store.dispatch("getItemsByType", {catName: this.catName, typeName: this.typeName, callback: (answ, err, _t) => {
				this.itemList = answ.data
			}})
		}
	}
</script>

<style>
</style>
