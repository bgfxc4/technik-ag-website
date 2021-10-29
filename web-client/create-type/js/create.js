window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()	

	request_categories(res => {
		for (var cat of res) {
			$('#create-type-category').append(`<option value="${cat.name}">${cat.name}</option>`)
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
