var logged_in = false
var search_tag = ""

window.onload = function () {

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
	
	search_tag = new URL(window.location).searchParams.get("search")
	
	if (search_tag == null) {
		window.location = '../inventory'
	}

	$("#top-bar input").val(decodeURIComponent(search_tag))

	var keywords = decodeURIComponent(search_tag).split(" ").filter(val => val !== " " && val !== "")
	send_search_items(keywords, res => {
		if (res === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		if (res.status != 200)
			return show_error_message(res.responseText)

		render_items(JSON.parse(res.responseText))
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
			<button onclick="window.location = '../../edit/item?id=${item.id}'"><i class="fa-solid fa-pen fa-2xl"></i></button>
			<button onclick="delete_item_clicked(this)"><i class="fa-solid fa-trash-can fa-2xl" style="color:red;"></i></button>
		</div>`
	
	var cf = ""
	for (var f in item.custom_fields) {
		cf += `<br><b>${f}:</b> ${item.custom_fields[f]}`
	}
	return `<div class="item-entry" item_id="${item.id}"><img onclick="window.location = '../item?category=${item.category}&type=${item.type}&id=${item.id}'" src="data:image/jpeg;base64,${item.image}"/>
			<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>
			<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id} ${cf}</div>${actions}</div>`

}

function search() {
	var keyword = $("#top-bar input").val()
	window.location = "./" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
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

var delete_item_id = ""
function delete_item_clicked(item) {
	var id = item.parentElement.parentElement.getAttribute("item_id")
	delete_item_id = id
	show_dialog("delete-item-dialog")
}

function delete_item_confirmed() {
	send_delete_item(delete_item_id, () => {
		window.location.reload()
	})
	delete_item_id = ""
}

function enter_delete_mode() {
	$('.fa-trash-can').css("display", "inline-block")
	$('#enter-delete-mode-btn').css("display", "none")
	$('#exit-delete-mode-btn').css("display", "inline-block")
}

function exit_delete_mode() {
	$('.fa-trash-can').css("display", "none")
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}
