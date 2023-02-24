<template>
	<div id="item">
		<nav aria-label="breadcrumb" class="mx-4 my-2">
			<ol class="breadcrumb" v-if="catId && typeId">
				<li class="breadcrumb-item"><router-link to='/inventory'>Inventory</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.query.category}/`'>{{ catName }}</router-link></li>
				<li class="breadcrumb-item"><router-link :to='`/inventory/${$route.query.category}/${$route.query.type}`'>{{ typeName }}</router-link></li>
				<li class="breadcrumb-item active" aria-current="page">{{ item.name }}</li>
			</ol>
		</nav>
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="container m-3">
			<div class="row" style="position: relative">
				<div class="col-5">
					<img v-if="item.id" v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + item.id" class="card-img" 
										style="max-width: 30vw; max-height: 30vh; width: auto; height: auto; margin-left: 0px">
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
						<b>Amount:</b> {{item.amount}}<br>
						<b>ID:</b> {{ item.id }}
					</div>

					<a id="menu-popover" class="menu-popover" tabindex="0">
						<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
					</a>
					<b-popover target="menu-popover" triggers="focus">
						<button v-b-modal.deleteItemModal class="btn btn-danger" style="max-height: 6vh">
							<font-awesome-icon icon="trash-can"/> Delete Item
						</button><br>
						<button v-b-modal.editItemModal class="btn btn-info" style="max-height: 6vh">
							<font-awesome-icon icon="pen"/> Edit Item
						</button><br>

						<ShowQrBarCode :toShow="item.id"></ShowQrBarCode>
					</b-popover>
				</div>
			</div>
			<div class="row mt-5">
				<div class="col-5">
					<h5>Current Appointments:</h5>
					<div v-if="currentAppointments.length == 0">None</div>
					<div class="appmnt-box bg-secondary" v-for="a in currentAppointments" :key="a.id">
						<router-link :to="`/appointments#${a.id}`">{{ a.name }}</router-link> - Amount: {{ a.amount }}
					</div>
				</div>
				<div class="col-5">
					<h5>Next Appointments:</h5>
					<div v-if="nextAppointments.length == 0">None</div>
					<div class="appmnt-box bg-secondary" v-for="a in nextAppointments" :key="a.id">
						<router-link :to="`/appointments#${a.id}`">{{ a.name }}</router-link> - Amount: {{ a.amount }}
					</div>
				</div>
			</div>
		</div>
		<delete-item :itemId="item.id" @onDelete="itemDeleted"/>
		<edit-item :item="item" @onEdit="loadItem"/>
	</div>
</template>

<script>
	import ShowQrBarCode from "../helpers/ShowQrBarCode.vue"
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"
	import DeleteItem from './delete/DeleteItem.vue'
	import EditItem from "./edit/EditItem.vue"

	export default {
		name: "Item",
		components: {
			ShowQrBarCode,
			ErrorText,
			LoadingIcon,
			DeleteItem,
			EditItem
		},
		data () {
			return {
				item: {},
				catName: "",
				typeName: "",
				catId: "",
				typeId: "",
				itemID: "",
				deleteItemId: "",
				errorText: "",
				isLoading: false,
				currentAppointments: [],
				nextAppointments: []
			}
		},
		methods: {
			itemDeleted () {
				this.$router.push(`/inventory/${this.item.category}/${this.item.type}`)
			},
			loadItem () {
				this.isLoading = true
				this.errorText = ""
				this.$store.dispatch("getItemByID", this.itemID).then(answ => {
					this.isLoading = false
					this.item = answ.data[0].equipment[0]
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})

				this.$store.dispatch("getItemAppointmentsByID", this.itemID).then(answ => {
					this.isLoading = false
					this.currentAppointments = answ.data.filter(el => el.date < Date.now() && el.end_date > Date.now())
					this.nextAppointments = answ.data.filter(el => el.date > Date.now())
					console.log(answ.data)
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			},
            loadType () {
				this.$store.dispatch("getCategories").then(answ => {
					this.isLoading = false
				    let c = answ.data.find(cat => cat.id == this.catId)
                    this.catName = c?.name
                    this.typeName = c?.types.find(type => type.id == this.typeId)?.name
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
            }
		},
		async created () {
			this.catId = this.$route.query.category
			this.typeId = this.$route.query.type
			this.itemID = this.$route.params.itemID
            this.loadType()
			this.loadItem()
		}
	}
</script>

<style scoped>
.menu-popover {
	position: absolute;
	top: 0;
	right: 8px;
	border: none;
	color: var(--bt-white)
}

.menu-popover:hover {
	border: none;
	color: var(--bt-white)
}

.appmnt-box {
	padding: 7px;
	border-radius: 4px;
	margin-bottom: 4px;
}
</style>
