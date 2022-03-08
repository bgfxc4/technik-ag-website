<template>
	<div id="inventory">
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="cat in categoryList" :key="cat.name" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-6 my-auto">
							<img v-bind:src="$store.state.apiUrl + '/get-category-img/' + cat.name" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; height: auto; margin-left: 10px">
						</div>
    					<div class="col-6 my-auto">
							<div class="card-body">
								<h5 class="card-title">{{ cat.name }}</h5>
								<router-link v-for="t in cat.types" :key="t" :to="`/inventory/${cat.name}/${t}`" 
									class="fs-6 text-break d-block text-truncate">{{ t }}</router-link>
								<router-link :to="`/inventory/${cat.name}/`" class="btn btn-outline-primary mt-2">Open Category</router-link>
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
		name: "Inventory",
		data () {
			return {
				categoryList: []
			}
		},
		async created () {
			this.$store.dispatch("getCategories", answ => {
				console.log(answ.data)
				this.categoryList = answ.data
			});
		}
	}
</script>

<style>
</style>
