window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
}

function create_category_clicked() {
	var category = {
		name: $('#create-category-name').val(),
	}
	send_create_category(category, res => {
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
