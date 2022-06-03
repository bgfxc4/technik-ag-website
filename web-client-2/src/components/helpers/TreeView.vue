<template>
    <div class="tree-view">
        <template v-if="!nodes && itemAtBottom && (!ignoreItemIDs || !ignoreItemIDs.includes(data.id))">
            <img v-bind:src="$store.state.apiUrl + '/equipment/getimg/' + data.id" style="max-width: 5vw; max-height: 5vh; width: auto; height: auto; margin-left: 10px; border-radius: 3px">
            {{data.name}} - Max. Amount: {{data.available_amount}}
            <button :disabled="data.available_amount <= 0" class="btn btn-outline-primary" @click="$emit('event', {'selected': data})"><font-awesome-icon icon="plus"/></button><br>
        </template>
        <div v-else :style="indent" @click="toggleChildren"> <font-awesome-icon v-if="!!nodes" :icon="['far', iconClass]"/> {{ label }}</div>
        <template v-if="showChildren">
            <tree-view 
                v-for="node in nodes"
                :data="node"
                :key="node.name"
                :nodes="node.equipment" 
                :label="node.name"
                :depth="depth+1"
                :itemAtBottom="itemAtBottom"
                :ignoreItemIDs="ignoreItemIDs"
                @event="handleEvent"
                >
            </tree-view>
        </template>
    </div>
</template>

<script>
    export default {
        name: "TreeView",
        props: [ 'label', 'nodes', 'depth', 'itemAtBottom', 'ignoreItemIDs', 'data'],
        emits: ['event'],
        computed: {
            indent() {
                return { transform: `translate(${this.depth * 50}px)` }
            },
            iconClass() {
                return this.showChildren ? 'square-minus' : 'square-plus'
            },
        },
        data () {
            return {
                showChildren: false
            }
        },
        methods: {
            toggleChildren () {
                this.showChildren = !this.showChildren
            },
            handleEvent (ev) {
                this.$emit("event", ev)
            }
        }
    }
</script>

<style>

</style>