<template>
	<div id="tools-checklists">
		<error-text v-if="!!errorText" :msg="errorText"/>
            <loading-icon v-if="isLoading" size="3x"/>
		<ul>
			<li v-for="l in lists" :key="l.id" class="m-2">
				<span @click="selectedList = JSON.parse(JSON.stringify(l)); selectedListSave = JSON.parse(JSON.stringify(l))" v-b-modal.checklistModal>
					<span class="text-primary btn-link">{{ l.name }}</span> - {{ l.items.filter(el => el.checked).length }} / {{ l.items.length }}
				</span>
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
					<label class="form-check-label" :for="`item-${i.id}`">{{ i.name }} - {{ i.id }}</label>
					<button class="btn btn-danger btn-sm mx-3" @click="selectedList.items.splice(selectedList.items.findIndex(el => el.id == i.id), 1)"><font-awesome-icon icon="trash-can"/></button><br>
				</div>
			</template>

            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>
            <button class="btn btn-primary mx-2" v-b-modal.newItemModal>New Item</button>
            <button id="checklistModalButton" class="btn btn-secondary mx-2" v-b-modal.checklistModal>Close</button>
            <button class="btn btn-outline-primary mx-2" @click="sendItemChanges" v-show="showApply">Apply</button>
        </div>
    </b-modal>
	<b-modal size="lg" id="newItemModal" class="text-secondary" centered hide-footer hide-header-close title="Create Item" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
			<label for="create-item-name">Name:</label><br/><input id="create-item-name" v-model="newItemName" placeholder="Enter a name for the item..."><br/>
            <loading-icon v-if="isLoading" size="3x"/>
            <error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/><br>

            <div>
                <h5>Create from:</h5>
                <b-tabs class="" content-class="mt-3 align-items: center">
                    <b-tab title="none">
                    </b-tab>
                    <b-tab @click="loadListAppmnts" title="Appointment checklist">
                        <button class="btn btn-sm btn-primary mx-1" v-for="a in createListAppmnts" :key="a.id" @click="createChecklistItems(a.items?.map(el => el.name))">
                            {{ a.name }}
                        </button>
                    </b-tab>
                    <b-tab @click="loadUsers" title="User checklist">
                        <button class="btn btn-sm btn-primary mx-1" @click="createChecklistItems(userList.map(el => el.display_name))">
                            <b>All users</b>
                        </button>
                        <button class="btn btn-sm btn-primary mx-1" v-for="g in groupList" :key="g.id" @click="createChecklistItems(userList.filter(el => el.group_id == g.id).map(el => el.display_name))">
                            <b>Group:</b> {{ g.name }}
                        </button>
                    </b-tab>
                </b-tabs>
            </div>

            <button id="newItemModalButton" class="btn btn-secondary mx-2" v-b-modal.checklistModal>Cancel</button>
            <button class="btn btn-outline-primary" @click="createItemByName">Create Item</button>
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
				newItemName: "",

                createListAppmnts: [],
                userList: [],
                groupList: [],
                
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
					this.lists.forEach(el => {
						el.items.sort((a, b) => a.id - b.id)	
					})

					if (this.selectedList?.id) {
						this.selectedList = this.lists.find(el => el.id == this.selectedList.id)
						this.selectedListSave = JSON.parse(JSON.stringify(this.selectedList))
					}
				}).catch(err => {
					this.errorText = err
				})
			},
			createList () {
				this.errorText = ""
				this.$store.dispatch("createChecklist", {name: this.newListName, items: []}).then(_ => {
					$("#newListModalButton").click()
					this.loadLists()
					this.newListName = ""
				}).catch(err => {
					this.errorText = err
				})
			},
			deleteList () {
				this.errorText = ""
				this.$store.dispatch("deleteChecklist", {id: this.deleteListID}).then(_ => {
					$("#deleteListModalButton").click()
					this.loadLists()
					this.deleteListID = ""
				}).catch(err => {
					this.errorText = err
				})
			},
			createItems (itemList) {
				this.errorText = ""
				this.$store.dispatch("checklistNewItems", {id: this.selectedList.id, items: itemList}).then(_ => {
					$("#newItemModalButton").click()
					this.loadLists()
					this.newItemName = ""
				}).catch(err => {
					this.errorText = err
				})
			},
            createItemByName () {
                this.createItems([this.newItemName])
            },
            createChecklistItems (itemNames) {
			    this.createItems(itemNames)	
            },
			sendItemChanges () {
				let deleted = this.selectedListSave.items.filter(el => this.selectedList.items.find(e => e.id == el.id) == undefined).map(el => el.id)
				let checkedChanges = this.selectedList.items.filter((e, idx) => this.selectedListSave.items[idx].checked != e.checked).filter(el => !deleted.includes(el.id))
				let proms = []
				if (deleted.length != 0) proms.push(this.$store.dispatch("checklistDeleteItems", {id: this.selectedList.id, items: deleted}))
				if (checkedChanges.length != 0) proms.push(this.$store.dispatch("checklistSetItemsChecked", {id: this.selectedList.id, items: checkedChanges.map(el => el.id), checked_list: checkedChanges.map(el => el.checked)}))
				Promise.all(proms).then(_ => {
					$("#checklistModalButton").click()
					this.loadLists()
					this.selectedList = null
					this.selectedListSave = null
				}).catch(err => {
					this.errorText = err
				})
			},
            loadListAppmnts () {
                this.$store.dispatch("getAppointmentList").then(res => {
                    this.createListAppmnts = res.data
                })
            },
            loadUsers () {
                this.$store.dispatch("getUsers").then(res => {
                    this.userList = res.data
                })
                this.$store.dispatch("getGroups").then(res => {
                    this.groupList = res.data
                })
            }
		},
		mounted () {
			this.loadLists()
		}
	}
</script>

<style scoped>
</style>
