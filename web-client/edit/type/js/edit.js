var name = ""
var cat_name = ""
var old_type

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")

	check_if_logged_in(() => {
		if (!logged_in)
			window.location = "../../inventory"
	})

	name = new URL(window.location).searchParams.get("name")
	cat_name = new URL(window.location).searchParams.get("cat")
	
	if (name == null || name == "" || cat_name == null || cat_name == "") {
		window.location = "../../inventory"
	}

	request_categories(res => {
		if (res === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		for (var cat of res) {
			if (cat.name == decodeURIComponent(cat_name)) {
				for (var type of cat.types) {
					if (type == decodeURIComponent(name)) {
						old_type = type
						fill_in_type(type)
					}
				}
			}
		}
	})
}

function fill_in_type(type) {
	$("#edit-type-name").val(type)
}

function to_data_url(url, callback) {
	var xhr = new XMLHttpRequest()
	xhr.onload = function() {
		var reader = new FileReader()
		reader.onloadend = function() {
			callback(reader.result)
		}
		reader.readAsDataURL(xhr.response)
	};
	xhr.open('GET', url)
	xhr.responseType = 'blob'
	xhr.send()
}

function edit_type_clicked() {
	if (!old_type) return

	var type = {
		old_name: decodeURIComponent(name),
		new_name: $('#edit-type-name').val(),
		category: decodeURIComponent(cat_name)
	}

	send_edit_type(type, res => {
		if (res.status != 200) {
			show_error_message(`${res.status}: ${res.responseText}`)
		} else {
			window.location = '../../inventory'
		}
	})
}

function hide_all_dialogs() {
	$("#dialog-container .dialog").css("visibility", "hidden")
	$("#dialog-container").css("visibility", "hidden")
}

function show_dialog(id) {
	$('#' + id).css("visibility", "visible")
	$("#dialog-container").css("visibility", "visible")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}
