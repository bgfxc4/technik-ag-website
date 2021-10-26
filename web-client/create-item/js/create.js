window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
}

function create_item_clicked() {
	load_image_base64("#create-item-image", img => {
		var item = {
			name: $('#create-item-name').val(),
			description: $('#create-item-description').val(),
			storage_place: $('#create-item-storage').val(),
			category: $('#create-item-category').val(),
			image: img
		}
		send_create_item(item, () => {
			window.location = '../'
		})
	})
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
