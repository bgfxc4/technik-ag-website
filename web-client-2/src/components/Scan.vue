<template>
	<div id="scan">
		<StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" />
	</div>
</template>

<script>
	import { StreamBarcodeReader } from "vue-barcode-reader"

	export default {
		name: "Scan",
		components: {
			StreamBarcodeReader
		},
		data() {
			return {

			}
		},
		methods: {
			onLoaded: function () {
				console.log("scanner lodad")
			},
			onDecode: function (a, b, c) {
				this.$router.push(`/inventory/item/byId/${a}`)
			}
		}
	}
</script>

<style>
</style>
