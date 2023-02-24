<template>
	<div id="category">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ catName }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="t in typeList" :key="t.id" class="col">
				<div class="card mb-3 bg-secondary" style="min-height: 20vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-12 my-auto">
							<div class="card-body">
								<h5 @click="openType(t.id)" role="button" class="card-title">{{ t.name }}</h5>
								<router-link v-for="i in t.items" :key="i.name" :to="`/inventory/item/byId/${i.id}?category=${i.category_id}&type=${i.type_id}`"
									class="fs-6 text-break d-block text-truncate">{{ i.name }}</router-link>
								<button @click="openType(t.id)" class="btn btn-outline-primary mt-2">Open Type</button>

								<a :id="'menu-popover-'+t.id" class="menu-popover" tabindex="0">
									<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
								</a>
								<b-popover :target="'menu-popover-'+t.id" triggers="focus">
									<button v-b-modal.deleteTypeModal @click="deleteTypeId = t.id" class="btn btn-danger" style="max-height: 6vh">
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
			<create-type :categoryId="catId" @onCreate="loadTypeList" />
		</div>
		<delete-type @onDelete="loadTypeList" :typeId="deleteTypeId" :typeName="typeList.find(el => el.id == deleteTypeId)?.name"/>
		<edit-type @onEdit="loadTypeList" :type="editType"/>
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
				catId: "",
                catName: "",
				deleteTypeId: undefined,
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
			openType(type) {
				this.$router.push(`/inventory/${this.catId}/${type}/`)
			},
			loadItemsForTypes: function (list) {
                if (list == null) return
				for (var t of list) {
					this.typeList.push({ name: t.name, id: t.id, items: [] })
					this.isLoading = true
					this.errorText = ""
					this.$store.dispatch("getItemsByType", {typeId: t.id}).then(answ => {
						this.isLoading = false
						if (!answ.res)
							return
						for (var i in this.typeList) {
							if (this.typeList[i].id == answ.typeId) {
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
						if (cat.id == this.catId) {
                            this.catName = cat.name
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
			this.catId = this.$route.params.category
			this.loadTypeList()
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
