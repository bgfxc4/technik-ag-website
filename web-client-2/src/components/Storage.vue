<template>
	<div id="storage">
		<loading-icon v-if="isLoading" size="3x"/>
		<ul class="tree h3 m-5">
			<li v-for="r of storage" :key="r.name"><a class="text-light" @click="clickTreeLink" href="#">{{r.name}}</a>
				<button v-b-modal.deleteRoomModal class="btn btn-danger btn-sm" @click="roomName=r.name">
					<font-awesome-icon icon="trash-can"/>
				</button>
				<ul>
					<li v-for="s of r.shelfs" :key="s.name"><a class="text-light" @click="clickTreeLink" href="#">{{s.name}}</a>
						<button v-b-modal.deleteShelfModal class="btn btn-danger btn-sm" @click="roomName=r.name; shelfName=s.name">
							<font-awesome-icon icon="trash-can"/>
						</button>
						<ul>
							<li v-for="c of s.compartments" :key="c.name">
								<a class="item-template text-light" href="#">{{c.name}}</a>
								<button v-b-modal.deleteCompModal class="btn btn-danger btn-sm" @click="roomName=r.name; shelfName=s.name; compName=c.name">
									<font-awesome-icon icon="trash-can"/>
								</button>
							</li>
							<button v-b-modal.createCompModal @click="roomName=r.name; shelfName=s.name" class="btn btn-secondary btn-sm">Create Compartment</button>
						</ul>
					</li>
					<button v-b-modal.createShelfModal @click="roomName=r.name" class="btn btn-secondary btn-sm">Create Shelf</button>
				</ul>
			</li>
			<button v-b-modal.createRoomModal class="btn btn-secondary btn-sm">Create Room</button>
		</ul>

		<b-modal size="lg" id="createRoomModal" class="text-secondary" centered hide-footer hide-header-close title="Create Room" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-room-name">Name:</label><br/><input id="create-room-name" v-model="roomName" placeholder="Enter a name..."><br/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createRoomModal>Cancel</b-button>
				<button class="btn btn-outline-primary" v-b-modal.createRoomModal @click="createRoom">Create Room</button>
			</div>
		</b-modal>
		<b-modal size="lg" id="createShelfModal" class="text-secondary" centered hide-footer hide-header-close title="Create Shelf" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-shelf-name">Name:</label><br/><input id="create-shelf-name" v-model="shelfName" placeholder="Enter a name..."><br/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createShelfModal>Cancel</b-button>
				<button class="btn btn-outline-primary" v-b-modal.createShelfModal @click="createShelf">Create Shelf</button>
			</div>
		</b-modal>
		<b-modal size="lg" id="createCompModal" class="text-secondary" centered hide-footer hide-header-close title="Create Compartment" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<label for="create-comp-name">Name:</label><br/><input id="create-comp-name" v-model="compName" placeholder="Enter a name..."><br/>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createCompModal>Cancel</b-button>
				<button class="btn btn-outline-primary" v-b-modal.createCompModal @click="createComp">Create Compartment</button>
			</div>

		</b-modal>
				<b-modal size="lg" id="deleteRoomModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Room" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<h6>Do you really want to delete the room?</h6>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteRoomModal>Cancel</b-button>
				<button class="btn btn-outline-danger" v-b-modal.deleteRoomModal @click="deleteRoom">Delete Room</button>
			</div>
		</b-modal>
		<b-modal size="lg" id="deleteShelfModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Shelf" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<h6>Do you really want to delete the shelf?</h6>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteShelfModal>Cancel</b-button>
				<button class="btn btn-outline-danger" v-b-modal.deleteShelfModal @click="deleteShelf">Create Shelf</button>
			</div>
		</b-modal>
		<b-modal size="lg" id="deleteCompModal" class="text-secondary" centered hide-footer hide-header-close title="Delete Compartment" header="test" header-class="justify-content-center">
			<div class="modal-body text-center">
				<h6>Do you really want to delete the compartment?</h6>
				<b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.deleteCompModal>Cancel</b-button>
				<button class="btn btn-outline-danger" v-b-modal.deleteCompModa @click="deleteComp">Delete Compartment</button>
			</div>
		</b-modal>
	</div>
</template>

<script>
	import LoadingIcon from "./helpers/LoadingIcon.vue"

	export default {
		name: "Storage",
		components: {
			LoadingIcon
		},
		data: function () {
			return {
				errorText: "",
				storage: [],
				isLoading: false,

				roomName: "",
				shelfName: "",
				compName: "",
			}
		},
		methods: {
            clickTreeLink (e) {
                var parent = e.target.parentElement;
                var classList = parent.classList;
                if(classList.contains("open")) {
                    classList.remove('open');
                    var opensubs = parent.querySelectorAll(':scope .open');
                    for(var i = 0; i < opensubs.length; i++){
                        opensubs[i].classList.remove('open');
                    }
                } else {
                    classList.add('open');
                }
                e.preventDefault();
            },
			getStorage () {
				this.isLoading = true
				this.$store.dispatch("getStorage", (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.storage = res.data
					console.log(this.storage)
				})
			},
			createRoom () {
				this.isLoading = true
				this.$store.dispatch("createRoom", {room: {name: this.roomName}, callback: (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.getStorage()
				}})
			},
			createShelf () {
				this.isLoading = true
				var shelf = {
					room: this.roomName,
					name: this.shelfName
				}
				this.$store.dispatch("createShelf", {shelf: shelf, callback: (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.roomName = ""
					this.getStorage()
				}})
			},
			createComp () {
				this.isLoading = true
				var comp = {
					room: this.roomName,
					shelf: this.shelfName,
					name: this.compName
				}
				this.$store.dispatch("createComp", {comp: comp, callback: (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.roomName = ""
					this.shelfName = ""
					this.getStorage()
				}})
			},

			deleteRoom () {
				this.isLoading = true
				this.$store.dispatch("deleteRoom", {room: {name: this.roomName}, callback: (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.roomName = ""
					this.getStorage()
				}})
			},
			deleteShelf () {
				this.isLoading = true
				var shelf = {
					room: this.roomName,
					name: this.shelfName
				}
				this.$store.dispatch("deleteShelf", {shelf: shelf, callback: (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.roomName = ""
					this.shelfName = ""
					this.getStorage()
				}})
			},
			deleteComp () {
				this.isLoading = true
				var comp = {
					room: this.roomName,
					shelf: this.shelfName,
					name: this.compName
				}
				this.$store.dispatch("deleteComp", {comp: comp, callback: (res, err) => {
					this.isLoading = false
					if (err) {
						this.errorText = err
						return
					}
					this.roomName = ""
					this.shelfName = ""
					this.compName = ""
					this.getStorage()
				}})
			},
		},
		created () {
			this.getStorage()
		}
	}
</script>

<style>
	li {
		margin: 10px;
	}

    ul.tree li {
        list-style-type: none;
        position: relative;
    }

    ul.tree li ul {
        display: none;
    }

    ul.tree li.open > ul {
        display: block;
    }

    ul.tree li a {
        text-decoration: none;
    }

    ul.tree li a:before {
        height: 1em;
        padding:0 .1em;
        font-size: .8em;
        display: block;
        position: absolute;
        left: -1.3em;
        top: .2em;
    }

    ul.tree li > a:not(:last-child):before {
        content: '‣';
    }

    ul.tree li.open > a:not(:last-child):before {
        content: '-';
    }
</style>
