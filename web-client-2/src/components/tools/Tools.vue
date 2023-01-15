<template>
	<div id="tools" class="container">
        <b-tabs card>
            <b-tab title="Checklists">
                <b-card-title>Checklists:</b-card-title>
                <b-card-text>
                	<tools-checklists/>
				</b-card-text>
            </b-tab>
        </b-tabs>
	</div>
</template>

<script>
import ToolsChecklists from './ToolsChecklists.vue'
	export default {
		name: "Tools",
		components: {
			ToolsChecklists
		},
		data () {
			return {}
		},
		methods: {
		}
	}
</script>

<style scoped>
</style>
