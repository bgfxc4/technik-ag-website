<template>
    <div class="rounded-panel overflow-auto bg-secondary">
        <h4>Requests:</h4>
        <div class="request-item bg-dark" v-for="r of list" :key="r.id">
            <b>Name:</b> {{r.name}}
            <b>Description:</b> {{r.description}} <br>
            <b>Date:</b> {{new Date(r.date).toLocaleDateString('de-DE', dateOptions)}} - {{new Date(r.end_date).toLocaleDateString('de-DE', dateOptions)}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "RequestList",
        data () {
            return {
                list: [],
                dateOptions: {weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric'}
            }
        },
        methods: {
            getRequests () {
                console.log("asd")
                this.$store.dispatch("getRequestList").then(res => {
                    this.list = res.data
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style>
    .rounded-panel {
        border-radius: 8px;
        margin-top: 2rem;
        height: calc(100% - 2rem);
    }
    .rounded-panel h4{
        margin-left: 4%
    }

    .request-item {
        border-radius: 6px;
        margin: 5px;
        padding: 5px;
    }
</style>