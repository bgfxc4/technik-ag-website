var logged_in = false
var categories = []
var item_to_edit

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in(() => {
		if (!logged_in)
			window.location = "../../inventory"
	})

	var item_id = new URL(window.location).searchParams.get("id")
	
	if (item_id == null || item_id == "") {
		window.location = "../../inventory"
	}

	request_equipment_by_id(item_id, equipment => {
		if (equipment === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		item_to_edit = equipment[0].equipment[0]
		fill_in_item(equipment[0].equipment[0])
	})
	request_categories(res => {
		categories = res
		for (var cat of res) {
			$('#edit-item-category').append(`<option value="${cat.name}">${cat.name}</option>`)
		}
		if (res[0] != undefined)
			render_types(res[0].name, item_to_edit)
	})
	to_data_url(`${server_url}get-item-img/${item_id}`, base64 => {
		$('#edit-image-preview')[0].src = base64
	})
}

function render_types(cat_name, item) {
	$('#edit-item-type').html("")
	$('#custom-field-container').html("")
	for (var cat of categories) {
		if (cat_name == cat.name) {
			for (var t of cat.types)
				$('#edit-item-type').append(`<option value="${t}">${t}</option>`)
			for (var f of cat.custom_fields)
				$('#custom-field-container').append(`<label for="custom-field-${f}">${f}:</label><br><input type="text" field-name="${f}" placeholder="Enter a value for ${f}..." id="custom-field-${f}"><br>`)
			if (item) fill_in_custom_fields(item)
			return
		}
	}
}

function fill_in_custom_fields(item) {
	for (var i in item.custom_fields) {
		$('#custom-field-' + i).val(item.custom_fields[i])
	}
}

var edit_id = ""
function fill_in_item(item) {
	edit_id = item.id
	$('#edit-item-name').val(item.name)
	$('#edit-item-description').val(item.description)
	$('#edit-item-storage').val(item.storage_place)
	$('#edit-item-category').val(item.category).change()
	render_types(item.category, item)
	$('#edit-item-type').val(item.type).change()
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

function load_image_preview(input_query, img_query) {
	load_image_base64(input_query, img => {
		$(img_query)[0].src = `data:image/jpeg;base64,${img}`
	})
}

function load_image_base64(query, callback) {
	if ($(query)[0].files.length == 0) {
		callback(undefined)
		return
	}
	var file = $(query)[0].files[0]
	var reader = new FileReader()
	reader.onloadend = function() {
		callback(reader.result.split('base64,')[1])
	}
	reader.readAsDataURL(file)
}

function edit_item_clicked() {
	var custom_fields = {}
	$("#custom-field-container input").each((i, el) => {
		custom_fields[$(el).attr('field-name')] = $(el).val()
	})
	var img = $('#edit-image-preview')[0].src.split("base64,")[1]
	var item = {
		id: edit_id,
		name: $('#edit-item-name').val(),
		description: $('#edit-item-description').val(),
		storage_place: $('#edit-item-storage').val(),
		category: $('#edit-item-category').val(),
		type: $('#edit-item-type').val(),
		image: img,
		custom_fields: custom_fields
	}
	send_edit_item(item, res => {
		if (res.status != 200) {
				display_error(`${res.status}: ${res.responseText}`)
			} else {
				window.location = '../../inventory'
			}
	})
}

function logout() {
	set_cookie("login_hash", "", 1)
	window.location.reload()
}

function display_error(msg) {
	$('#error-text').text(msg)
}
