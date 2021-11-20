var cat_name = ""

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()	

	cat_name = new URL(window.location).searchParams.get("category")

	request_categories(res => {
		for (var cat of res) {
			$('#create-type-category').append(`<option value="${cat.name}">${cat.name}</option>`)
		}
		if (cat_name != null) {
			$('#create-type-category').val(decodeURIComponent(cat_name))
			$('#create-type-category').select()
		}
	})
}

function create_type_clicked() {
	var type = {
		name: $('#create-type-name').val(),
		category: $('#create-type-category').val(),
	}
	send_create_type(type, res => {
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
