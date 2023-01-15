<template>
	<div id="tools-checklists">
		<error-text v-if="!!errorText" :msg="errorText"/>
            <loading-icon v-if="isLoading" size="3x"/>
		<ul>
			<li v-for="l in lists" :key="l.id" class="m-2">
				<span @click="selectedList = l; selectedListSave = JSON.parse(JSON.stringify(l))" v-b-modal.checklistModal><span class="text-primary btn-link">{{ l.name }}</span> - {{ l.items.filter(el => el.checked).length }} / {{ l.items.length }}</span>
				<button class="btn btn-danger btn-sm mx-3" @click="deleteListID = l.id" v-b-modal.deleteListModal><font-awesome-icon icon="trash-can"/></button>
			</li>
		</ul>
		<button class="btn btn-primary mb-3" v-b-modal.newListModal>New list</button>
		<p v-if="!lists.length">none</p>
	</div>

	<b-modal size="lg" id="newListModal" class="text-secondary" centered hide-footer hide-header-close title="Create List" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
			<label for="create-req-name">Name:</label><br/><input id="create-list-name" v-model="newListName" placeholder="Enter a name for the list..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <b-button id="newListModalButton" class="btn btn-secondary mx-2" v-b-modal.newListModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="createList">Create List</button>
        </div>
    </b-modal>
	<b-modal size="lg" id="deleteListModal" class="text-secondary" centered hide-footer hide-header-close title="Delete List" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
			Do you really want to delete the list?
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <b-button id="deleteListModalButton" class="btn btn-secondary mx-2" v-b-modal.deleteListModal>Cancel</b-button>
            <button class="btn btn-outline-danger" @click="deleteList">Delete List</button>
        </div>
    </b-modal>
	<b-modal size="lg" id="checklistModal" class="text-secondary" centered hide-footer hide-header-close :title="selectedList?.name" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
			<template v-if="selectedList">
				<div v-for="i in selectedList.items" :key="i.id">
					<input class="form-check-input" type="checkbox" v-model="i.checked" :id="`item-${i.id}`">
					<label class="form-check-label" :for="`item-${i.id}`">{{ i.name }} - {{ i.id }}</label><br>
				</div>
			</template>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <button id="checklistModalButton" class="btn btn-secondary mx-2" v-b-modal.checklistModal>Close</button>
            <button class="btn btn-outline-primary mx-2" @click="sendItemChanges" v-show="showApply">Apply</button>
        </div>
    </b-modal>
</template>

<script>
import ErrorText from "../helpers/ErrorText.vue"
import LoadingIcon from "../helpers/LoadingIcon.vue"
	export default {
		name: "ToolsChecklists",
		components: {
			ErrorText,
			LoadingIcon
		},
		data () {
			return {
				lists: [],
				errorText: "",
				isLoading: false,

				newListName: "",
				deleteListID: "",

				selectedList: {},
				selectedListSave: {}
			}
		},
		computed: {
			showApply () {
				if (!this.selectedList?.items || !this.selectedListSave?.items || this.selectedList?.items?.length != this.selectedListSave?.items?.length
				|| this.selectedList.items.filter((e, idx) => this.selectedListSave.items[idx].checked != e.checked || this.selectedListSave.items[idx].name != e.name).length != 0) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			loadLists () {
				this.errorText = ""
				this.$store.dispatch("getChecklistList").then(res => {
					this.lists = res.data
				}).catch(err => {
					this.errorText = err
				})
			},
			createList () {
				this.errorText = ""
				this.$store.dispatch("createChecklist", {name: this.newListName, items: []}).then(res => {
					$("#newListModalButton").click()
					this.loadLists()
					this.newListName = ""
				}).catch(err => {
					this.errorText = err
				})
			},
			deleteList () {
				this.errorText = ""
				this.$store.dispatch("deleteChecklist", {id: this.deleteListID}).then(res => {
					$("#deleteListModalButton").click()
					this.loadLists()
					this.deleteListID = ""
				}).catch(err => {
					this.errorText = err
				})
			},
			sendItemChanges () {
				let checkedChanges = this.selectedList.items.filter((e, idx) => this.selectedListSave.items[idx].checked != e.checked)
				if (checkedChanges.length != 0) {
					this.$store.dispatch("checklistSetItemsChecked", {id: this.selectedList.id, items: checkedChanges.map(el => el.id), checked_list: checkedChanges.map(el => el.checked)}).then(res => {
						$("#checklistModalButton").click()
						this.loadLists()
						this.selectedList = null
						this.selectedListSave = null
					}).catch(err => {
						this.errorText = err
					})
				}
			}
		},
		mounted () {
			this.loadLists()
		}
	}
</script>

<style scoped>
</style>
