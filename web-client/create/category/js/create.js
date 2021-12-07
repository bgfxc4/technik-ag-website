var custom_fields = []

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
}

function create_category_clicked() {
	var category = {
		name: $('#create-category-name').val(),
		custom_fields: custom_fields,
		image: (!!$('#create-category-preview')[0].src) ? $('#create-category-preview')[0].src.split('base64,')[1] : undefined
	}
	send_create_category(category, res => {
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
