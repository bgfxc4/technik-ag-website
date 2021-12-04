var logged_in = false

window.onload = function () {

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	request_categories(cats => {
		if (cats === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_categories(cats)
	})
}

function render_categories(cats) {

	var s = ""
	for (var category of cats) {
		var loc = './category/?category=' + encodeURIComponent(category.name)
		s += `<button class="category-btn" category_name="${category.name}" onclick="window.location = '${loc}'">${category.name}</button>`
		
	}
	$("#equipment-container").prepend(s)
}

function search() {
	var keyword = $("#top-bar input").val()
	window.location = "../search/" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
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

var delete_category_name = ""
function delete_category_clicked(item) {
	var name = item.getAttribute("category_name")
	delete_category_name = name
	show_dialog("delete-category-dialog")
}

function delete_category_confirmed() {
	send_delete_category(delete_category_name, () => {
		window.location.reload()
	})
	delete_category_name = ""
}

function enter_delete_mode() {
	$('.category-btn').addClass('red-btn')
	$('.category-btn').each((i, el) => {
		$(el).attr('onclick-tmp', $(el).attr('onclick'))
		$(el).attr('onclick', 'delete_category_clicked(this)')
	})
	$('#enter-delete-mode-btn').css("display", "none")
	$('#exit-delete-mode-btn').css("display", "inline-block")
}

function exit_delete_mode() {
	$('.category-btn').removeClass('red-btn')
	$('.category-btn').each(el => {
		$(el).attr('onclick', $(el).attr('onclick-tmp'))
	})
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}