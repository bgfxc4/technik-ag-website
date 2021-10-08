var server_url = "https://bgfxc4.de/technikag-api/" 

function request_equipment() {
	var res = make_get_request(`${server_url}get-equipment`)
	if (res.status == 401)
		window.location = window.location.href + "login.html"
	return JSON.parse(res.responseText)
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
