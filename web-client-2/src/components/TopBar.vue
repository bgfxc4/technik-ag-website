<template>
	<nav class="navbar navbar-expand-lg navbar-dark bg-secondary">
		<div class="container-fluid">
			<router-link class="navbar-brand" to="/">Technik AG</router-link>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<router-link to="/inventory" class="nav-link" v-bind:class="{ active: ($route.path.startsWith('/inventory'))}" aria-current="page">Inventory</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/storage" class="nav-link" v-bind:class="{ active: ($route.path.startsWith('/storage'))}">Storage</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/appointments" class="nav-link disabled">Appointments</router-link>
					</li>
					<li class="nav-item">
						<router-link to="/scan" class="nav-link" v-bind:class="{ active: ($route.path.startsWith('/scan'))}">Scan Code</router-link>
					</li>
				</ul>
				<form class="d-flex search-form" onclick="return false">
					<input class="form-control me-2 bg-light text-dark" type="search" placeholder="Search" aria-label="Search" v-model=searchStr>
					<button class="btn btn-outline-primary" v-on:click=openSearch>Search</button>
				</form>
				<template v-if=isLoggedIn>
					<button id="trigger-login-popover" class="btn btn-dark login-status" href="#" tabindex="0">
						<font-awesome-icon icon="circle-user" class="fa-xl"></font-awesome-icon>
					</button>
					<b-popover target="trigger-login-popover" triggers="focus">
					  <div class="text-dark">You are logged in.</div><a href="javascript:void(0);" v-on:click=logout>Log out</a>
					</b-popover>
				</template>
				<button v-if=!isLoggedIn class="btn btn-secondary login-status" id="not-logged-in" v-on:click=openLogin>Sign in</button>
			</div>
		</div>
	</nav>

</template>

<script>
	export default {
		name: "TopBar>",
		data () {
			return {
				searchStr: "" 
			}
		},
		computed: {
			isLoggedIn: function () {return this.$store.getters.isAuthenticated}
		},
		methods: {
			logout: async function () {
				await this.$store.dispatch("LogOut")
			},
			openLogin: function () {
				this.$router.push("/login")
			},
			openSearch: function () {
				this.$router.push("/search")
			}
		}
	}
</script>

<style>
	.login-status {
		height: 4vh;
		margin-left: 10px !important;
	}
</style>
