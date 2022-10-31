<template>
	<div id="storage">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="room in roomList" :key="room.name" class="col">
				<div class="card mb-3 bg-secondary" style="height: 16vh">
			  		<div class="row g-0" style="height: 100%">
						<div class="card-body" style="max-height: 30vh">
							<h5 @click="openRoom(room.name)" role="button" class="card-title">{{ room.name }}</h5>
							<div style="max-height: 15vh; overflow: hidden;">
								<router-link v-for="t in room.shelfs" :key="t" :to="`/storage/${room.name}/${t.name}`" 
									class="fs-6 text-break d-block text-truncate">{{ t.name }}</router-link>
							</div>
							<button @click="openRoom(room.name)" class="btn btn-outline-primary mt-2">Open Room</button> <br>

							<a :id="'menu-popover-'+room.name" class="menu-popover" tabindex="0">
								<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
							</a>
							<b-popover :target="'menu-popover-'+room.name" triggers="focus">
								<button v-b-modal.deleteRoomModal @click="deleteRoomName = room.name" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/> Delete Room
								</button>
								<button @click="editRoomName = room.name" v-b-modal.editRoomModal class="btn btn-info" style="max-height: 6vh">
									<font-awesome-icon icon="pen"/> Edit Room
								</button>
							</b-popover>
						</div>
					</div>
				</div>
			</div>
			<create-room @onCreate="loadRoomList" />
		</div>

		<delete-room :room="deleteRoomName" @onDelete="loadRoomList" />
		<edit-room :room="editRoomName" @onEdit="loadRoomList" />
	</div>
</template>

<script>
	import ErrorText from "../helpers/ErrorText.vue"
	import LoadingIcon from '../helpers/LoadingIcon.vue'
	import CreateRoom from "./create/CreateRoom.vue"
	import DeleteRoom from './delete/DeleteRoom.vue'
	import EditRoom from './edit/EditRoom.vue'

	export default {
		name: "Storage",
		components: {
			ErrorText,
			CreateRoom,
			LoadingIcon,
			DeleteRoom,
			EditRoom,
		},
		data () {
			return {
				roomList: [],
				errorText: "",
				isLoading: false,
				deleteRoomName: undefined,
				editRoomName: undefined
			}
		},
		methods: {
			openRoom(name) {
				this.$router.push(`/storage/${name}/`)
			},
			async loadRoomList () {
				this.isLoading = true
				this.roomList = []
				this.$store.dispatch("getStorage").then(answ => {
					this.isLoading = false
					this.roomList = answ.data
				}).catch(err => {
					this.isLoading = false
					this.errorText = err
				})
			}
		},
		async created () {
			this.loadRoomList()
		}
	}
</script>

<style>
.menu-popover {
	position: absolute;
	top: 8px;
	right: 8px;
	border: none;
	color: var(--bt-white)
}

.menu-popover:hover {
	border: none;
	color: var(--bt-white)
}
</style>
