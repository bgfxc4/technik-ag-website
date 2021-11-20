var logged_in = false
var cat_name = ""

window.onload = function () {

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
	
	cat_name = new URL(window.location).searchParams.get("category")
	
	if (cat_name == null) {
		window.location = "../"
	}

	request_categories(cats => {
		if (cats === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_types(cats, cat_name)
	})
}

function render_types(cats, cat_name) {

	var s = ""
	for (var category of cats) {
		if (category.name == cat_name) {
			for (var t of category.types) {
				var loc = '../type/?category=' + encodeURIComponent(cat_name) + '&type=' + encodeURIComponent(t)
				s += `<button class="type-btn" type_name="${t}" onclick="window.location = '${loc}'">${t}</button>`
			}
		}
		
	}
	$("#equipment-container").prepend(s)
}

function search() {
	var keyword = $("#top-bar input").val()
	window.location = window.location + "search/" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
}

function logout() {
	set_cookie("login_hash", "", 1)
	window.location.reload()
}

function hide_all_dialogs() {
	$(".dialog").css("visibility", "hidden")
	$("#dialog-container").css("visibility", "hidden")
}

function show_dialog(id) {
	$('#' + id).css("visibility", "visible")
	$("#dialog-container").css("visibility", "visible")
}

var delete_type_name = ""
function delete_type_clicked(item) {
	var name = item.getAttribute("type_name")
	delete_type_name = name
	show_dialog("delete-type-dialog")
}

function delete_type_confirmed() {
	send_delete_type(delete_type_name, cat_name, () => {
		window.location.reload()
	})
	delete_type_name = ""
}

function enter_delete_mode() {
	$('.type-btn').addClass('red-btn')
	$('.type-btn').each((i, el) => {
		$(el).attr('onclick-tmp', $(el).attr('onclick'))
		$(el).attr('onclick', 'delete_type_clicked(this)')
	})
	$('#enter-delete-mode-btn').css("display", "none")
	$('#exit-delete-mode-btn').css("display", "inline-block")
}

function exit_delete_mode() {
	$('.type-btn').removeClass('red-btn')
	$('.type-btn').each(el => {
		$(el).attr('onclick', $(el).attr('onclick-tmp'))
	})
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}
