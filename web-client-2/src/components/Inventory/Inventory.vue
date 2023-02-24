<template>
	<div id="inventory">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="cat in categoryList" :key="cat.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-6 my-auto">
							<img @click="openCategory(cat.id)" role="button" v-bind:src="$store.state.apiUrl + '/category/getimg/' + cat.id" class="card-img" 
								style="max-width: 30vw; max-height: 30vh; height: auto; margin-left: 10px">
						</div>
    					<div class="col-6 my-auto" style="max-height: 30vh">
							<div class="card-body" style="max-height: 30vh">
								<h5 @click="openCategory(cat.id)" role="button" class="card-title">{{ cat.name }}</h5>
								<div style="max-height: 15vh; overflow: hidden;">
									<router-link v-for="t in cat.types" :key="t" :to="`/inventory/${cat.id}/${t.id}`" 
										class="fs-6 text-break d-block text-truncate">{{ t.name }}</router-link>
								</div>
								<button @click="openCategory(cat.id)" class="btn btn-outline-primary mt-2">Open Category</button> <br>

								<a :id="'menu-popover-'+cat.id" class="menu-popover" tabindex="0">
									<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
								</a>
								<b-popover :target="'menu-popover-'+cat.id" triggers="focus">
									<button v-b-modal.deleteCategoryModal @click="deleteCategoryId = cat.id" class="btn btn-danger" style="max-height: 6vh">
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
		<delete-category @onDelete="loadCategoryList" :categoryId="deleteCategoryId" :categoryName="categoryList.find(el => el.id == deleteCategoryId)?.name"/>
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
				deleteCategoryId: undefined,
				editCategory: {}
			}
		},
		methods: {
			openCategory(id) {
				this.$router.push(`/inventory/${id}/`)
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
