function try_login() {
	var username = document.getElementById("usernameInput").value
	var password = document.getElementById("passwordInput").value
	var login_hash = sha512("technikag" + username + ":" + password)

	var xhr = new XMLHttpRequest()
	var url = server_url + "authorize"
	xhr.onload = function() {
		if (xhr.status == 200) {
			set_cookie("login_hash", login_hash, 14)
			window.location = "../" 
		} else {
			document.getElementById("errorText").hidden = false
		}
	}
	xhr.open("POST", url)
	xhr.setRequestHeader("content-type", "application/json")
	xhr.send(JSON.stringify({login_hash: login_hash}))
}
