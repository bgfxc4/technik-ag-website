var server_url = "https://bgfxc4.de/technikag-api/" 

function request_equipment(callback) {
	make_get_request(`${server_url}get-equipment`, res => {
		if (res.responseText == undefined || res.status != 200)
			callback(undefined)
		else {
			if (res.status == 401)
				window.location = window.location.href + "login"
			callback(JSON.parse(res.responseText))
		}
	})
}

function request_categories(callback) {
	make_get_request(`${server_url}get-categories`, res => {
		if (res.responseText == undefined || res.status != 200)
			callback(undefined)
		else {
			if (res.status == 401)
				window.location = window.location.href + "login"
			callback(JSON.parse(res.responseText))
		}
	})
}

function request_equipment_by_id(id, callback) {
	make_get_request(`${server_url}get-equipment-by-id/${id}`, res => {
		if (res.responseText == undefined || res.status != 200)
			callback(undefined)
		else
			callback(JSON.parse(res.responseText))
	})
}

function send_create_item(item, callback) {
	item.login_hash = get_cookie("login_hash")
	make_post_request(server_url + "new-equipment", item, res => {
		callback(res)
	})
}

function send_create_category(category, callback) {
	category.login_hash = get_cookie("login_hash")
	make_post_request(server_url + "new-category", category, res => {
		callback(res)
	})
}

function send_edit_item(item, callback) {
	item.login_hash = get_cookie("login_hash")
	make_post_request(server_url + "edit-equipment", item, res => {
		callback(res)
	})
}

function send_delete_item(id, callback) {
	var body = {
		login_hash: get_cookie("login_hash"),
		id: id,
	}
	make_post_request(server_url + "delete-equipment", body, res => {
		callback(res)
	})
}

function send_delete_category(name, callback) {
	var body = {
		login_hash: get_cookie("login_hash"),
		name: name,
	}
	make_post_request(server_url + "delete-category", body, res => {
		callback(res)
	})
}

function make_post_request(url, content, callback) {
	var xhr = new XMLHttpRequest()
	xhr.onreadystatechange = function() {
		if (this.readyState != 4)
			return
		callback({responseText: xhr.responseText, status: xhr.status})
	}
	xhr.onerror = function() {
		callback({responseText: undefined, status: xhr.status})
	}
    xhr.open("POST", url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(content))
}

function make_get_request(url, callback) {
	var xhr = new XMLHttpRequest()	
	xhr.onreadystatechange = function() {
		if (this.readyState != 4)
			return
		callback({responseText: xhr.responseText, status: xhr.status})
	}
	xhr.onerror = function() {
		callback({responseText: undefined, status: xhr.status})
	}
    xhr.open("GET", url, true)
	xhr.send()
}

function set_cookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function get_cookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function check_if_logged_in() {
	var login_hash = get_cookie("login_hash")
	if (login_hash != "") {
		var xhr = new XMLHttpRequest()
		var url = server_url + "authorize"
		xhr.onload = function() {
			if (xhr.status == 200) {
				logged_in = true
				$("#logged-in").css("display", "inline")
				$("#not-logged-in").css("display", "none")
				$(".admin-only").css("visibility", "visible")
			}
		}
		xhr.open("POST", url)
		xhr.setRequestHeader("content-type", "application/json")
		xhr.send(JSON.stringify({login_hash: login_hash}))
	}
}
