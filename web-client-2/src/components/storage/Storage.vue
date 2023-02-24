<template>
	<div id="storage">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<div class="row row-cols-1 row-cols-lg-3 g-4 m-3">
			<div v-for="room in roomList" :key="room.id" class="col">
				<div class="card mb-3 bg-secondary" style="height: 16vh">
			  		<div class="row g-0" style="height: 100%">
						<div class="card-body" style="max-height: 30vh">
							<h5 @click="openRoom(room.id)" role="button" class="card-title">{{ room.name }}</h5>
							<div style="max-height: 15vh; overflow: hidden;">
								<router-link v-for="s in room.shelfs" :key="s.id" :to="`/storage/${room.id}/${s.id}`" 
									class="fs-6 text-break d-block text-truncate">{{ s.name }}</router-link>
							</div>
							<button @click="openRoom(room.id)" class="btn btn-outline-primary mt-2">Open Room</button> <br>

							<a :id="'menu-popover-'+room.id" class="menu-popover" tabindex="0">
								<font-awesome-icon icon="bars" class="fa-xl"></font-awesome-icon>
							</a>
							<b-popover :target="'menu-popover-'+room.id" triggers="focus">
								<button v-b-modal.deleteRoomModal @click="deleteRoomId = room.id" class="btn btn-danger" style="max-height: 6vh">
									<font-awesome-icon icon="trash-can"/> Delete Room
								</button>
								<button @click="editRoomId = room.id" v-b-modal.editRoomModal class="btn btn-info" style="max-height: 6vh">
									<font-awesome-icon icon="pen"/> Edit Room
								</button>
							</b-popover>
						</div>
					</div>
				</div>
			</div>
			<create-room @onCreate="loadRoomList" />
		</div>

		<delete-room :room="deleteRoomId" @onDelete="loadRoomList" />
		<edit-room :room="editRoomId" @onEdit="loadRoomList" />
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
				deleteRoomId: undefined,
				editRoomId: undefined
			}
		},
		methods: {
			openRoom(id) {
				this.$router.push(`/storage/${id}/`)
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
