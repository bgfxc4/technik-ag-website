var server_url = "https://bgfxc4.de/technikag-api/" 

function request_equipment() {
	var res = make_get_request(`${server_url}get-equipment`)
	if (res.status == 401)
		window.location = window.location.href + "login.html"
	return JSON.parse(res.responseText)
}

function request_equipment_by_id(id) {
	var res = make_get_request(`${server_url}get-equipment-by-id/${id}`)
	return JSON.parse(res.responseText)
}

function send_create_item(item, callback) {
	item.login_hash = get_cookie("login_hash")
	make_post_request(server_url + "new-equipment", item)
	callback()
}

function send_delete_item(id, callback) {
	var body = {
		login_hash: get_cookie("login_hash"),
		id: id,
	}
	make_post_request(server_url + "delete-equipment", body)
	callback()
}

function make_post_request(url, content) {
	var xhr = new XMLHttpRequest()
    xhr.open("POST", url, false)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(content))
    return {responseText: xhr.responseText, status: xhr.status}
}

function make_get_request(url) {
	var xhr = new XMLHttpRequest()
    xhr.open("GET", url, false)
	xhr.send()
    return {responseText: xhr.responseText, status: xhr.status}
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
