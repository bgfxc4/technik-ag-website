<template>
	<div id="inventory">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
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
								<br>
    							<button v-b-modal.deleteCategoryModal @click="deleteCategoryName = cat.name" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<create-category @onCreate="loadCategoryList" />
		</div>
		<delete-category @onDelete="loadCategoryList" :categoryName="deleteCategoryName"/>
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from '../helpers/LoadingIcon.vue'
	import CreateCategory from "./create/CreateCategory.vue"
	import DeleteCategory from './delete/DeleteCategory.vue'

	export default {
		name: "Inventory",
		components: {
			ErrorText,
			CreateCategory,
			LoadingIcon,
			DeleteCategory,
		},
		data () {
			return {
				categoryList: [],
				errorText: "",
				isLoading: false,
				deleteCategoryName: undefined
			}
		},
		methods: {
			async loadCategoryList () {
				this.isLoading = true
				this.$store.dispatch("getCategories", (answ, err) => {
					this.isLoading = false
					if (!answ) {
						this.errorText = err
						return
					}
					this.categoryList = answ.data
				});
			}
		},
		async created () {
			this.loadCategoryList()
		}
	}
</script>

<style>
</style>
