<template>
	<div id="search">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<p class="mx-4 my-2">Search results for "{{ keyword }}"</p>
		<div class="row row-cols-1 g-4 m-3">
			<div v-for="item in itemList" :key="item.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 32vh">
			  		<div class="row g-0" style="height: 100%">
    					<div class="col-4 my-auto">
							<img v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + item.id" class="card-img" 
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
								<router-link :to="`/inventory/item/byId/${item.id}?category=${item.category}&type=${item.type}`" class="btn btn-outline-primary mt-2">Open Item</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from "../helpers/LoadingIcon.vue"

	export default {
		name: "Search",
		data () {
			return {
				itemList: [],
				keyword: "",
				errorText: "",
				isLoading: false
			}
		},
		components: {
			ErrorText,
			LoadingIcon
		},
		methods: {
			search: function () {
				this.itemList = []
				this.isLoading = true
				this.errortext = ""
				this.$store.dispatch("getItemsBySearch", {keyword: this.keyword, callback: (answ, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.itemList = answ.data
				}})
			}
		},
		async created () {
			this.keyword = this.$route.params.keyword
			this.search()

			this.$watch(() => this.$route.params.keyword, to => {
				this.keyword = to
				this.search()
			})
		}
	}
</script>

<style>
</style>
