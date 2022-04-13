<template>
	<div id="storage">
		<loading-icon v-if="isLoading" size="3x"/>
		<error-text v-if="!!errorText" v-bind:msg="errorText" class="mx-3 my-2"/>
		<ul class="tree h3 m-4">
			<li v-for="r of storage" :key="r.name"><a class="text-light" @click="clickTreeLink" href="#">{{r.name}}</a>
				<delete-room v-if="deleteMode" @onClick="roomName=r.name;" :room="roomName" @onDelete="getStorage" />
				<edit-room v-if="editMode" @onClick="roomName=r.name" :room="roomName" @onEdit="getStorage" />
				<ul>
					<li v-for="s of r.shelfs" :key="s.name"><a class="text-light" @click="clickTreeLink" href="#">{{s.name}}</a>
						<delete-shelf v-if="deleteMode" @onClick="roomName=r.name; shelfName=s.name;" :room="roomName" :shelf="shelfName" @onDelete="getStorage" />
						<edit-shelf v-if="editMode" @onClick="roomName=r.name; shelfName=s.name;" :room="roomName" :shelf="shelfName" @onEdit="getStorage" />
						<ul>
							<li v-for="c of s.compartments" :key="c.name">
								<a class="item-template text-light" href="#">{{c.name}}</a>
								<delete-comp v-if="deleteMode" @onClick="roomName=r.name; shelfName=s.name; compName=c.name" :room="roomName" :shelf="shelfName" :comp="compName" @onDelete="getStorage" />
								<edit-comp v-if="editMode" @onClick="roomName=r.name; shelfName=s.name; compName=c.name" :room="roomName" :shelf="shelfName" :comp="compName" @onEdit="getStorage" />
							</li>
							<create-comp :room="roomName" :shelf="shelfName" @onClick="shelfName=s.name;roomName=r.name" @onCreate="getStorage" />
						</ul>
					</li>
					<create-shelf :room="roomName" @onClick="roomName=r.name" @onCreate="getStorage" />
				</ul>
			</li>
			<create-room @onCreate="getStorage" />
			<button v-if="!deleteMode" @click="deleteMode=true" class="btn btn-danger btn-sm" type="button">Enter Delete Mode</button>
			<button v-if="deleteMode" @click="deleteMode=false" class="btn btn-danger btn-sm" type="button">Exit Delete Mode</button>

			<button v-if="!editMode" @click="editMode=true" class="btn btn-info btn-sm" type="button">Enter Edit Mode</button>
			<button v-if="editMode" @click="editMode=false" class="btn btn-info btn-sm" type="button">Exit Edit Mode</button>
		</ul>
	</div>
</template>

<script>
	import LoadingIcon from "../helpers/LoadingIcon.vue"
	import ErrorText from "../helpers/ErrorText.vue"
	import CreateRoom from "./create/CreateRoom.vue"
	import CreateShelf from "./create/CreateShelf.vue"
	import CreateComp from "./create/CreateCompartment.vue"
	import DeleteComp from "./delete/DeleteCompartment.vue"
	import DeleteShelf from "./delete/DeleteShelf.vue"
	import DeleteRoom from "./delete/DeleteRoom.vue"
	import EditRoom from "./edit/EditRoom.vue"
	import EditShelf from "./edit/EditShelf.vue"
	import EditComp from "./edit/EditComp.vue"

	export default {
		name: "Storage",
		components: {
			LoadingIcon,
			ErrorText,
			CreateRoom,
			CreateShelf,
			CreateComp,
			DeleteComp,
			DeleteShelf,
			DeleteRoom,
			EditRoom,
			EditShelf,
			EditComp
		},
		data: function () {
			return {
				deleteMode: false,
				editMode: false,
				errorText: "",
				storage: [],
				isLoading: false,

				roomName: "", // for actions like edit, delete and create to pass down to trhe modals
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
				})
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
