var logged_in = false
var cat_name = ""
var type_name = ""

window.onload = function () {

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
	
	cat_name = new URL(window.location).searchParams.get("category")
	type_name = new URL(window.location).searchParams.get("type")
	
	if (cat_name == null) {
		window.location = "../"
	} else if (type_name == null) {
		window.location = '../category?category=' + encodeURIComponent(cat_name)
	}

	request_equipment_by_type(cat_name, type_name, items => {
		if (items === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_items(items)
	})
}

function render_items(items) {

	var s = ""
	for (var i of items) {
		if (s != "")
			s += "<hr>"
		s += generate_html_for_item(i)
	}
	$("#equipment-container").prepend(s)
}

function generate_html_for_item(item) {
	var actions = `<div class="actions admin-only" ${logged_in ? '' : 'style="visibility: hidden;'}">
			<button onclick="gencode_clicked(this)"><i class="fa-solid fa-barcode fa-2xl"></i></button>
			<button onclick="window.location = '../edit-item?id=${item.id}'"><i class="fa-solid fa-pen fa-2xl"></i></button>
			<button onclick="delete_item_clicked(this)"><i class="fa-solid fa-trash-can fa-2xl" style="color:red;"></i></button>
		</div>`
	
	var cf = ""
	for (var f in item.custom_fields) {
		cf += `<br><b>${f}:</b> ${item.custom_fields[f]}`
	}
	return `<div class="item-entry" item_id="${item.id}"><img onclick="window.location = '../item?id=${item.id}'" src="data:image/jpeg;base64,${item.image}"/>
			<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>
			<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id} ${cf}</div>${actions}</div>`

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
