<template>
	<div id="scan">
		<StreamBarcodeReader v-if="scanning" @decode="onDecode" @loaded="onLoaded" />
        <loading-icon v-if="isLoading" size="3x"/>
        <error-text v-if="!!errorText" class="m-3" v-bind:msg="errorText"/>
		<button v-if="!scanning" class="btn btn-info m-3" @click="scanning = true; errorText = ''">The scan failed. Try again.</button>

		<create-item :useID="createItemID" v-if="createItemID"/>
	</div>
</template>

<script>
	import { StreamBarcodeReader } from "vue-barcode-reader"
    import ErrorText from "./helpers/ErrorText.vue"
    import LoadingIcon from "./helpers/LoadingIcon.vue"
	import CreateItem from "./Inventory/create/CreateItem.vue"

	export default {
		name: "Scan",
		components: {
			StreamBarcodeReader,
			ErrorText,
			LoadingIcon,
			CreateItem
		},
		data() {
			return {
				errorText: "",
				isLoading: false,
				scanning: true,

				createItemID: undefined,
			}
		},
		methods: {
			onLoaded: function () {
				console.log("scanner lodad")
			},
			onDecode: function (a, b, c) {
				this.errorText = ""
				this.isLoading = false
				this.createItem = undefined
				this.$store.dispatch("getItemByID", a).then(res => {
					this.isLoading = false
					if (res.data.length != 0) {
						this.$router.push(`/inventory/item/byId/${a}`)
						return
					}

					this.scanning = false
					if (!this.isUUID(a.substr(1))) { // first char has to be removed bc it is not part of the uuid but indicates the type if ID
						this.errorText = "The ID you scanned is not a valid UUID!"
						return
					}
					this.errorText = "The ID you scanned is a valid UUID but not in the database!"

					if (a[0] == 'I')
						this.createItemID = a
					else 
						this.errorText = "The ID you scanned is not a valid UUID!"

				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			},
			isUUID (s) {
				return s.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) !== null
			}
		}
	}
</script>

<style>
</style>
