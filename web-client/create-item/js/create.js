var categories = []

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	request_categories(res => {
		categories = res
		for (var cat of res) {
			$('#create-item-category').append(`<option onclick="render_types(${cat.name})" value="${cat.name}">${cat.name}</option>`)
		}
		if (res[0] != undefined)
			render_types(res[0].name)
	})
}

function render_types(cat_name) {
	console.log("Rendering: ", cat_name)
	$('#create-item-type').html("")
	for (var cat of categories) {
		if (cat_name == cat.name) {
			for (var t of cat.types)
				$('#create-item-type').append(`<option value="${t}">${t}</option>`)
			return
		}
	}
}

function create_item_clicked() {
	load_image_base64("#create-item-image", img => {
		var item = {
			name: $('#create-item-name').val(),
			description: $('#create-item-description').val(),
			storage_place: $('#create-item-storage').val(),
			category: $('#create-item-category').val(),
			type: $('#create-item-type').val(),
			image: img
		}
		send_create_item(item, res => {
			if (res.status != 200) {
				display_error(`${res.status}: ${res.responseText}`)
			} else {
				window.location = '../'
			}
		})
	})
}

function display_error(msg) {
	$('#error-text').text(msg)
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