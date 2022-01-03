var custom_fields = []
var name = ""
var old_cat
var fields_changed = false

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")

	check_if_logged_in(() => {
		if (!logged_in)
			window.location = "../../inventory"
	})

	name = new URL(window.location).searchParams.get("name")
	
	if (name == null || name == "") {
		window.location = "../../inventory"
	}

	request_categories(res => {
		if (res === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		for (var cat of res) {
			if (cat.name == decodeURIComponent(name)) {
				old_cat = cat
				fill_in_cat(cat)
			}
		}
	})
	to_data_url(`${server_url}get-category-img/${name}`, base64 => {
		$('#edit-image-preview')[0].src = base64
	})
}

function fill_in_cat(cat) {
	$("#edit-category-name").val(cat.name)
	custom_fields = cat.custom_fields
	render_field_names()
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

function edit_category_clicked() {
	if (!old_cat) return

	var category = {
		old_name: decodeURIComponent(name),
		new_name: $('#edit-category-name').val(),
		custom_fields: custom_fields,
		image: (!!$('#edit-image-preview')[0].src) ? $('#edit-image-preview')[0].src.split('base64,')[1] : undefined
	}

	if (category.name == old_cat.name)
		category.name = undefined
	if (!fields_changed)
		category.custom_fields = undefined
	if (category.image == old_cat.image)
		category.image = undefined

	send_edit_category(category, res => {
		if (res.status != 200) {
			display_error(`${res.status}: ${res.responseText}`)
		} else {
			window.location = '../../inventory'
		}
	})
}

function create_field_confirmed() {
	var name = $('#create-field-name').val()
	$('#create-field-name').val("")
	if (custom_fields.includes(name)) {
		hide_all_dialogs()
		display_error("A field with this name exists already!")
		return 
	}

	custom_fields.push(name)
	hide_all_dialogs()
	render_field_names()
	fields_changed = true
}

function render_field_names() {
	$('#field-container').html("")
	for (var s in custom_fields) {
		$('#field-container').append(`-${custom_fields[s]} <a style="color:red; text-decoration: underline red; cursor: pointer;" onclick="remove_field(${s})">remove</a><br>`)
	}
}

function remove_field(index) {
	custom_fields.splice(index, 1)
	render_field_names()
	fields_changed = true
}

function hide_all_dialogs() {
	$("#dialog-container .dialog").css("visibility", "hidden")
	$("#dialog-container").css("visibility", "hidden")
}

function show_dialog(id) {
	$('#' + id).css("visibility", "visible")
	$("#dialog-container").css("visibility", "visible")
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

function display_error(msg) {
	$('#error-text').text(msg)
}
