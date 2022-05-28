<template>
    <div v-if="!hidden" style="position: fixed; width: 100vw; height: 100vh; background-color: #3337; right: 0; top: 0">
        <div style="width: 40vw; border-radius: 5px; position: absolute; background-color: #fff; border-width: 3px; left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <h3>Select an item</h3><br>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>

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
            <br>
            <br>
            <button class="btn btn-secondary mb-5" @click="close">Cancel</button>
        </div>
    </div>
</template>

<script>
    import ErrorText from "./ErrorText.vue"
    import LoadingIcon from "./LoadingIcon.vue"

    export default {
        name: "ItemSelector",
        emits: ["selected"],
        components: {
            ErrorText,
            LoadingIcon
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
                items: []
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
            }
        }
    }
</script>

<style>

</style>