<template>
    <b-button v-b-modal.codeModal>Show QR/BarCode

        <b-modal size="lg" id="codeModal" class="text-secondary" hide-footer>
            <!-- <barcode v-if="barcodeToggle" style="width: 100%;" class="mx-auto" :value="toShow?.substring(0,14)">{{toShow}}</barcode> -->
            <BarcodeGenerator
            v-if="barcodeToggle"
            class="mx-auto"
    :value="toShow?.substring(0,14)"
    :format="'CODE39'"
    :lineColor="'#000'"
    style="width: 100%"
    :elementTag="'img'"
  /> 
            <QrcodeVue v-if="!barcodeToggle" class="mx-auto" style="max-width: 100%; display: block" :value="toShow">{{toShow}}</QrcodeVue>
            <button class="btn btn-outline-secondary" @click="barcodeToggle = !barcodeToggle">Toggle QR/Barcode</button>
        </b-modal>
    </b-button>
</template>

<script>
    import BarcodeGenerator from './BarcodeGenerator.vue'
    import QrcodeVue from "qrcode.vue"

    export default {
        name: "ShowQrBarCode",
        data () {
            return {
                barcodeToggle: false
            }
        },
        components: {
            BarcodeGenerator,
            QrcodeVue,
        },
        props: {
            toShow: String,
        }
    }
</script>

<style>
</style>