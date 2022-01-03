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
	console.log(cats)
	var s = ""
	for (var category of cats) {
		var loc = './category/?category=' + encodeURIComponent(category.name)
		var types = ""
		for (var t of category.types) {
			types += `<a href='./type/?category=${encodeURIComponent(category.name)}&type=${encodeURIComponent(t)}'>${t}</a><br>`
			console.log(encodeURIComponent(t), t)
		}
		var img = `<img src="${server_url}get-category-img/${category.name}"/>`
		s += `<button class="category-btn" category_name="${category.name}" onclick="window.location = '${loc}'">
				<div><h2>${category.name}</h2> <br> ${types}</div> ${img}
			</button>`
		
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

function edit_category_clicked(item) {
	var name = item.getAttribute("category_name")
	window.location = `../edit/category?name=${encodeURIComponent(name)}`
}

function enter_delete_mode() {
	exit_edit_mode()
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
	$('.category-btn').each((i, el) => {
		$(el).attr('onclick', $(el).attr('onclick-tmp'))
	})
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function enter_edit_mode() {
	exit_delete_mode()
	$('.category-btn').addClass('blue-btn')
	$('.category-btn').each((i, el) => {
		$(el).attr('onclick-tmp', $(el).attr('onclick'))
		$(el).attr('onclick', 'edit_category_clicked(this)')
	})
	$('#enter-edit-mode-btn').css("display", "none")
	$('#exit-edit-mode-btn').css("display", "inline-block")
}

function exit_edit_mode() {
	$('.category-btn').removeClass('blue-btn')
	$('.category-btn').each((i, el) => {
		$(el).attr('onclick', $(el).attr('onclick-tmp'))
	})
	$('#enter-edit-mode-btn').css("display", "inline-block")
	$('#exit-edit-mode-btn').css("display", "none")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}
