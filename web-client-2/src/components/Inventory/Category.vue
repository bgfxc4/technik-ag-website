<template>
	<div id="category">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ $route.params.category }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="t in typeList" :key="t.name" class="col">
				<div class="card mb-3 bg-secondary" style="min-height: 20vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-12 my-auto">
							<div class="card-body">
								<h5 @click="openType(catName, t.name)" role="button" class="card-title">{{ t.name }}</h5>
								<router-link v-for="i in t.items" :key="i.name" :to="`/inventory/item/byId/${i.id}?category=${i.category}&type=${i.type}`"
									class="fs-6 text-break d-block text-truncate">{{ i.name }}</router-link>
								<button @click="openType(catName, t.name)" class="btn btn-outline-primary mt-2">Open Type</button>

								<button :id="'menu-popover-'+t.name" class="btn btn-dark mt-2 mx-2" href="#" tabindex="0">
									<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
								</button>
								<b-popover :target="'menu-popover-'+t.name" triggers="focus">
									<button v-b-modal.deleteTypeModal @click="deleteTypeName = t.name" class="btn btn-danger" style="max-height: 6vh">
										<font-awesome-icon icon="trash-can"/> Delete Type
									</button><br>
									<button @click="editType = t" v-b-modal.editTypeModal class="btn btn-info" style="max-height: 6vh">
										<font-awesome-icon icon="pen"/> Edit Type
									</button>
								</b-popover>
							</div>
						</div>
					</div>
				</div>
			</div>
			<create-type :categoryName="catName" @onCreate="loadTypeList" />
		</div>
		<delete-type @onDelete="loadTypeList" :typeName="deleteTypeName" :categoryName="catName"/>
		<edit-type @onEdit="loadTypeList" :type="editType" :catName="catName"/>
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"
	import CreateType from "./create/CreateType.vue"
	import DeleteType from "./delete/DeleteType.vue"
	import EditType from "./edit/EditType.vue"

	export default {
		name: "Category",
		data () {
			return {
				typeList: [],
				catName: "",
				deleteTypeName: undefined,
				errorText: "",
				isLoading: false,
				editType: {}
			}
		},
		components: {
			ErrorText,
			LoadingIcon,
			CreateType,
			DeleteType,
			EditType
		},
		methods: {
			openType(cat, type) {
				this.$router.push(`/inventory/${cat}/${type}/`)
			},
			loadItemsForTypes: function (list) {
				for (var t of list) {
					this.typeList.push({ name: t, items: [] })
					this.isLoading = true
					this.errorText = ""
					this.$store.dispatch("getItemsByType", {catName: this.catName, typeName: t}).then(answ => {
						this.isLoading = false
						if (!answ.res)
							return
						for (var i in this.typeList) {
							if (this.typeList[i].name == answ.typeName) {
								this.typeList[i].items = answ.res.data
							}
						}
					}).catch(err => {
						this.errorText = err
						this.isLoading = false
					})
				}
			},
			loadTypeList () {
				this.isLoading = true
				this.typeList = []
				this.$store.dispatch("getCategories").then(answ => {
					this.isLoading = false
					for (var cat of answ.data) {
						if (cat.name == this.catName) {
							this.loadItemsForTypes(cat.types)
						}
					}
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.catName = this.$route.params.category
			this.loadTypeList()
		}
	}
</script>

<style>
</style>
