<template>
	<div id="settings">
		<!-- Sidebar  -->
		<nav id="sidebar">
			<div class="sidebar-header">
				<h3>Settings</h3>
			</div>

			<ul class="list-unstyled components">
				<button class="btn btn-dark" @click="sidebarItemClicked">
					<font-awesome-icon icon="circle-user" class="disableClick" size="lg"></font-awesome-icon>
					<div class="title disableClick">Users</div>
				</button>
			</ul>
			<button id="contract-button" class="btn btn-dark" onclick="$('#sidebar').toggleClass('active');"><font-awesome-icon icon="backward-step" /></button>
		</nav>

		<div id="content" style="width: 100%;">
			<manage-users />
		</div>
	</div>
</template>

<script>
	import ManageUsers from "./ManageUsers/ManageUsers.vue"

	export default {
		name: "SettingsPanel",
		components: {
			ManageUsers
		},
		data () {
			return {}
		},
		methods: {
			sidebarItemClicked(e) {
				$(".btn-outline-dark").removeClass("btn-outline-dark").removeClass("text-light").addClass("btn-dark")
				$(e.target).removeClass("btn-dark").addClass("btn-outline-dark").addClass("text-light")
			}
		}
	}
</script>

<style>
.disableClick {
	pointer-events: none;
}

#app {
	height: 100vh;
	display: flex;
    flex-direction: column;
}

#settings {
	display: flex;
	align-items: stretch;
	height: 100%;
}

#sidebar {
	background-color: var(--bs-secondary);
	position: relative;
	width: 150px;
}

#contract-button {
	width: 80%;
	left: 10%;
	position: absolute;
	bottom: 2%;
}

/* Shrinking the sidebar from 250px to 80px and center aligining its content*/
#sidebar.active {
    min-width: 50px;
    max-width: 50px;
    text-align: center;
}

#sidebar.active .sidebar-header h3 {
    display: none;
}

#sidebar ul button {
    text-align: center;
    display: block;
	margin-left: 7px;
}

#sidebar.active ul button {
    text-align: center;
    font-size: 0.85em;
	margin-left: 0;
}

#sidebar.active ul button font-awesome-icon {
    margin-right:  0;
    font-size: 1.8em;
    margin-bottom: 5px;
}

#sidebar ul button .title {
    display: inline-block
}

#sidebar.active ul button .title {
    display: none
}

/* Same dropdown links padding*/
#sidebar.active ul button {
    padding: 10px !important;
}

/* Changing the arrow position to bottom center position, 
   translateX(50%) works with right: 50% 
   to accurately  center the arrow */
#sidebar.active .dropdown-toggle::after {
    top: auto;
    bottom: 10px;
    right: 50%;
    -webkit-transform: translateX(50%);
    -ms-transform: translateX(50%);
    transform: translateX(50%);
}
</style>
