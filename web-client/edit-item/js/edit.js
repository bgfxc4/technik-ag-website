var logged_in = false

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	var item_id = new URL(window.location).searchParams.get("id")
	
	if (item_id == null || item_id == "") {
		window.location = "../"
	}

	request_equipment_by_id(item_id, equipment => {
		if (equipment === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		fill_in_item(equipment[0].equipment[0])
	})
}

var edit_id = ""
function fill_in_item(item) {
	edit_id = item.id
	$('#edit-item-name').val(item.name)
	$('#edit-item-description').val(item.description)
	$('#edit-item-storage').val(item.storage_place)
	$('#edit-item-category').val(item.category)
	$('#edit-image-preview')[0].src = `data:image/jpeg;base64,${item.image}`
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

function edit_item_clicked()  {
	var item = {
		id: edit_id,
		name: $('#edit-item-name').val(),
		description: $('#edit-item-description').val(),
		storage_place: $('#edit-item-storage').val(),
		category: $('#edit-item-category').val(),
		image: $('#edit-image-preview')[0].src.split("base64,")[1]
	}
	send_edit_item(item, res => {
		if (res.status != 200) {
				display_error(`${res.status}: ${res.responseText}`)
			} else {
				window.location = '../'
			}
	})
}

function display_error(msg) {
	$('#error-text').text(msg)
}
