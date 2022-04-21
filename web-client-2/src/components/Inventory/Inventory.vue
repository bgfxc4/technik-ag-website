<template>
	<div id="inventory">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="cat in categoryList" :key="cat.name" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-6 my-auto">
							<img @click="openCategory(cat.name)" role="button" v-bind:src="$store.state.apiUrl + '/category/getimg/' + cat.name" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; height: auto; margin-left: 10px">
						</div>
    					<div class="col-6 my-auto" style="max-height: 30vh">
							<div class="card-body" style="max-height: 30vh">
								<h5 @click="openCategory(cat.name)" role="button" class="card-title">{{ cat.name }}</h5>
								<div style="max-height: 15vh; overflow: hidden;">
									<router-link v-for="t in cat.types" :key="t" :to="`/inventory/${cat.name}/${t}`" 
										class="fs-6 text-break d-block text-truncate">{{ t }}</router-link>
								</div>
								<button @click="openCategory(cat.name)" class="btn btn-outline-primary mt-2">Open Category</button> <br>

								<button :id="'menu-popover-'+cat.name" class="btn btn-dark mt-2" href="#" tabindex="0">
									<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
								</button>
								<b-popover :target="'menu-popover-'+cat.name" triggers="focus">
									<button v-b-modal.deleteCategoryModal @click="deleteCategoryName = cat.name" class="btn btn-danger" style="max-height: 6vh">
										<font-awesome-icon icon="trash-can"/> Delete Category
									</button>
									<button @click="editCategory = cat" v-b-modal.editCategoryModal class="btn btn-info" style="max-height: 6vh">
										<font-awesome-icon icon="pen"/> Edit Category
									</button>
								</b-popover>
							</div>
						</div>
					</div>
				</div>
			</div>
			<create-category @onCreate="loadCategoryList" />
		</div>
		<delete-category @onDelete="loadCategoryList" :categoryName="deleteCategoryName"/>
		<edit-category @onEdit="loadCategoryList" :category="editCategory"/>
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from '../helpers/LoadingIcon.vue'
	import CreateCategory from "./create/CreateCategory.vue"
	import DeleteCategory from './delete/DeleteCategory.vue'
	import EditCategory from './edit/EditCategory.vue'

	export default {
		name: "Inventory",
		components: {
			ErrorText,
			CreateCategory,
			LoadingIcon,
			DeleteCategory,
			EditCategory,
		},
		data () {
			return {
				categoryList: [],
				errorText: "",
				isLoading: false,
				deleteCategoryName: undefined,
				editCategory: {}
			}
		},
		methods: {
			openCategory(name) {
				this.$router.push(`/inventory/${name}/`)
			},
			async loadCategoryList () {
				this.isLoading = true
				this.$store.dispatch("getCategories").then(answ => {
					this.isLoading = false
					this.categoryList = answ.data
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.loadCategoryList()
		}
	}
</script>

<style>
</style>
