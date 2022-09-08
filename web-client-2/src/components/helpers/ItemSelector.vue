<template>
    <div v-if="!hidden" style="position: fixed; width: 100vw; height: 100vh; background-color: #3337; right: 0; top: 0">
        <div style="width: 40vw; border-radius: 5px; position: absolute; background-color: #fff; border-width: 3px; left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <h3>Select an item</h3><br>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>

            <div style="margin-left: 20px">
                <b-tabs class="" content-class="mt-3">
                    <b-tab title="By Category">
                        
                        <tree-view
                        @click="showCamComp = false" 
                        v-for="c of items"
                        :data="c"
                        :key="c.name"
                        :label="c.name"
                        :nodes="c.types"
                        :depth="0"
                        :itemAtBottom="true"
                        :ignoreItemIDs="ignoreIDs"
                        @event="handleTreeEvent"
                        >
                        </tree-view>

                    </b-tab>

                    <b-tab @click="showCamComp = false" title="List All" active>
                        <template v-for="c of items" :key="c.name">
                            <template v-for="t of c.types" :key="t.name">
                                <template v-for="i of t.equipment" :key="i.id">
                                    <template v-if="!ignoreIDs || !ignoreIDs.includes(i.id)">
                                        <img v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + i.id" style="max-width: 5vw; max-height: 5vh; width: auto; height: auto; margin-left: 10px; border-radius: 3px">
                                        {{i.name}} - Max. Amount: {{i.available_amount}}
                                        <button :disabled="onlyIfAvailable && i.available_amount <= 0" class="btn btn-outline-primary" @click="$emit('selected', i); close()"><font-awesome-icon icon="plus"/></button><br>
                                    </template>
                                </template>
                            </template>
                        </template>
                    </b-tab>

                    <b-tab @click="showCamComp = true" title="Scan Code">
		                <StreamBarcodeReader v-if="showCamComp" @decode="onDecode"/>
                    </b-tab>
                </b-tabs>
            </div>
            <br>
            <br>
            <button class="btn btn-secondary mb-5" @click="close">Cancel</button>
        </div>
    </div>
</template>

<script>
    import TreeView from "./TreeView.vue"
    import ErrorText from "./ErrorText.vue"
    import LoadingIcon from "./LoadingIcon.vue"
	import { StreamBarcodeReader } from "vue-barcode-reader"

    export default {
        name: "ItemSelector",
        emits: ["selected"],
        components: {
            ErrorText,
            LoadingIcon,
            TreeView,
            StreamBarcodeReader
        },
        props: {
            duringAppointment: String,
            ignoreIDs: Array,
            onlyIfAvailable: Boolean
        },
        data () {
            return {
                errorText: "",
                isLoading: false,
                hidden: true,
                items: [],
                showCamComp: false
            }
        },
        methods: {
            show () {
                this.hidden = false
                this.isLoading = true
                if (this.duringAppointment) {
                    this.$store.dispatch("getEquipmentDuringAppointment", {appointment: this.duringAppointment}).then(res => this.renderItems(res.data)).catch(err => {
                        this.errorText = err
                    })
                } else {
                    this.$store.dispatch("getEquipment").then(res => this.renderItems(res)).catch(err => {
                        this.errorText = err
                    })
                }
            },
            close () {
                this.hidden = true
                this.isLoading = false
                this.errorText = ""
            },
            renderItems (res) {
                this.isLoading = false
                this.errorText = ""
                this.items = res
            },
            handleTreeEvent (ev) {
                if (ev.selected) {
                    this.$emit('selected', ev.selected)
                    this.close()
                }
            },
            onDecode (a, b, c) {
				this.errorText = ""
				this.isLoading = false
				this.createItem = undefined
				this.$store.dispatch("getItemByID", a).then(res => {
					this.isLoading = false
					if (res.data.length != 0) {
                        this.errorText = JSON.stringify(res.data)
                        this.$emit('selected', res.data[0].equipment[0])
                        this.close()
						return
					}
                    this.errorText = "The Code you scanned does not belong to any item in the database!"
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
            }
        }
    }
</script>

<style>
    .nav .nav-item .nav-link {
        background-color: #eee !important;
        color: var(--bs-dark) !important
    }
    .nav .nav-item .nav-link.active {
        background-color: #fff !important
    }
</style>