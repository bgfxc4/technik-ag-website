var custom_fields = []

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
}

function create_category_clicked() {
	var category = {
		name: $('#create-category-name').val(),
		custom_fields: custom_fields,
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
	for (var s of custom_fields) {
		$('#field-container').append(`-${s}<br>`)
	}
}

function hide_all_dialogs() {
	$("#dialog-container .dialog").css("visibility", "hidden")
	$("#dialog-container").css("visibility", "hidden")
}

function show_dialog(id) {
	$('#' + id).css("visibility", "visible")
	$("#dialog-container").css("visibility", "visible")
}

function display_error(msg) {
	$('#error-text').text(msg)
}
