<template>
	<div id="login">
		<div id="login-panel">
			<div id="center">
				<h1>Login</h1>
				<form @submit.prevent="submit">
					<input id="usernameInput" type="text" placeholder="Please enter your username" v-model="usernameInput">
					<input id="passwordInput" type="password" placeholder="Please enter your password" v-model="passwordInput">
					<button id="login-btn" class="btn btn-light" type="button" v-on:click=tryLogin >Login</button>
					<button class="btn btn-outline-light" type="button" v-on:click=openHome >Cancel</button>
				</form>
				<loading-icon v-if="isLoading" size="3x"/>
				<error-text v-if="!!errorText" v-bind:msg="errorText" />
			</div>
		</div>
		<div id="divider-panel"></div>
		<div id="logo-panel">
			<img :src='require("../assets/imgs/logo.png")'>
		</div>
	</div>
</template>

<script>
	import { mapActions } from "vuex"
	import ErrorText from "./helpers/ErrorText.vue"
	import LoadingIcon from "./helpers/LoadingIcon.vue"

	export default {
		name: "Login",
		components: {
			ErrorText,
			LoadingIcon
		},
		data() {
			return {
				usernameInput: "",
				passwordInput: "",
				errorText: "",
				isLoading: false
			}
		},
		methods: {
			...mapActions(["LogIn"]),
			async tryLogin() {
				this.errorText = ""
				const User = new FormData()
				User.append("username", this.usernameInput)
				User.append("password", this.passwordInput)
				this.isLoading = true
				try {
					await this.LogIn(User)
					this.$router.push("/")
				} catch (error) {
					this.setError(error)
				}
				this.isLoading = false
			},
			setError(msg) {
				this.errorText = msg
			},
			openHome() {
				this.$router.push("/")
			}
		},
		mounted () {
			$('#passwordInput').keydown(e => {
				if (e.which == 13) {//enter
					$('#login-btn').click()
				}
			})
		}
	}
</script>

<style>
	#login {
		position: relative;
		background-color: black;
		font-size: 2.7vh;
		height: 100vh;
	}

	#login-panel {
		z-index: 400;
		background: var(--secondary-background-color);
		width: 40%;
		height: 100%;
		float: left;
		clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);
		text-align: center;
		position: relative;
	}

	#login-panel #center {
		margin: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -60%);
	}

	#login-panel #center h1 {
		margin-top: 0;
		padding: 0;
		display: block;
	}

	#login-panel #center input {
		display: block;
		margin-left: auto;
		margin-right: auto;
		margin-top: 30px;
		font-size: 1.8vh;
	}

	#divider-panel {
		z-index: 300;
		position: absolute;
		background: #c60002;
		width: 40%;
		height: 100%;
		left: 2%;
		top: 0;
		clip-path: polygon(0 0, 100% 0%, 75% 100%, 0% 100%);

	}

	#logo-panel {
		z-index: 200;
		position: relative;
		height: 100%;
		width: 60%;
		float: right;
		background-color: black;
	}

	#logo-panel img {
		margin: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
