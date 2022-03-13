<template>
	<div id="category">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.category }}</li>
			</ol>
		</nav>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="t in typeList" :key="t.name" class="col">
				<div class="card mb-3 bg-secondary" style="min-height: 20vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-12 my-auto">
							<div class="card-body">
								<h5 class="card-title">{{ t.name }}</h5>
								<router-link v-for="i in t.items" :key="i.name" :to="`/inventory/item/byId/${i.id}?category=${i.category}&type=${i.type}`" 
									class="fs-6 text-break d-block text-truncate">{{ i.name }}</router-link>
								<router-link :to="`/inventory/${catName}/${t.name}`" class="btn btn-outline-primary mt-2">Open Type</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import ErrorText from "../ErrorText.vue"

	export default {
		name: "Category",
		data () {
			return {
				typeList: [],
				catName: "",
				errorText: ""
			}
		},
		components: {
			ErrorText
		},
		methods: {
			loadItemsForTypes: async function (list) {
				for (var t of list) {
					this.typeList.push({ name: t, items: [] })
					this.$store.dispatch("getItemsByType", {catName: this.catName, typeName: t, callback: (answ, err, _t) => {
						if (!answ)
							return
						for (var i in this.typeList) {
							if (this.typeList[i].name == _t) {
								this.typeList[i].items = answ.data
							}
						}
					}})
				}
			}
		},
		async created () {
			this.catName = this.$route.params.category
			this.$store.dispatch("getCategories", (answ, err) => {
				if (!answ) {
					this.errorText = err
					return
				}
				for (var cat of answ.data) {
					if (cat.name == this.catName) {
						this.loadItemsForTypes(cat.types)
					}
				}
			})
		}
	}
</script>

<style>
</style>
