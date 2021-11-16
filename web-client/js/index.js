var logged_in = false
var qrcode

window.onload = function () {
	qrcode = new QRCode("qrcode-container")

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	var search_keyword = new URL(window.location).searchParams.get("search")
	
	if (search_keyword != null) {
		$("#search-message").text(`Search results for "${search_keyword}"`)
		$("#top-bar input").val(search_keyword)
		$("#top-bar button.x").css("display", "block")
	}

	request_equipment(equipment => {
		if (equipment === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_equipment(equipment, search_keyword)
	})
}

function render_equipment(equipment, search_keyword) {
	$("#equipment-container").html("")
	var outer = ""
	for (var category of equipment) {
		var types = ""
		for (var type of category.types) {
			var inner = ""
			for (var item of type.equipment) {
				if (!item.name.toLowerCase().includes(decodeURIComponent(search_keyword).toLowerCase()) && search_keyword !== null)
					continue
				if (inner != "")
					inner += "<hr>"
				inner += generate_html_for_item(item)
			}
			if (search_keyword === null || inner != "") {
				types += `<button type="button" class="collapsible type" type_name="${type.name}">${type.name} <div class="actions admin-only">
					<i onclick="delete_type_clicked(this)" class="fa-solid fa-trash-can fa-xl" style="color:red;"></i>
					</div></button>
				<div class="collapsible-content type">${inner}</div>`
			}
		}
		if (search_keyword === null || types != "") {
			outer += `<button type="button" class="collapsible category" category_name="${category.name}">${category.name} <div class="actions admin-only">
					<i onclick="delete_category_clicked(this)" class="fa-solid fa-trash-can fa-xl" style="color:red;"></i>
				</div></button>
			<div class="collapsible-content category">${types}</div>`
		}
	}
	$("#equipment-container").append(outer)
	setup_item_dropdown()
}

function generate_html_for_item(item) {
	var actions = `<div class="actions admin-only" ${logged_in ? '' : 'style="visibility: hidden;'}">
			<button onclick="gencode_clicked(this)"><i class="fa-solid fa-barcode fa-2xl"></i></button>
			<button onclick="window.location = './edit-item?id=${item.id}'"><i class="fa-solid fa-pen fa-2xl"></i></button>
			<button onclick="delete_item_clicked(this)"><i class="fa-solid fa-trash-can fa-2xl" style="color:red;"></i></button>
		</div>`
	
	var cf = ""
	for (var f in item.custom_fields) {
		cf += `<br><b>${f}:</b> ${item.custom_fields[f]}`
	}
	return `<div class="item-entry" item_id="${item.id}"><img onclick="window.location = './item?id=${item.id}'" src="data:image/jpeg;base64,${item.image}"/>
			<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>
			<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id} ${cf}</div>${actions}</div>`

}

function search() {
	var keyword = $("#top-bar input").val()
	window.location = window.origin + window.location.pathname + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
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

var code_id = ""
function gencode_clicked(e) {	
	var id = e.parentNode.parentNode.getAttribute("item_id")
	code_id = id
	qrcode.makeCode(id)
	JsBarcode("#barcode-container", id.substring(0, 15), {
		width: 1,
		height: 50
	})
	show_dialog("qrcode-dialog")
}

var delete_item_id = ""
function delete_item_clicked(item) {
	var id = item.parentNode.parentNode.getAttribute("item_id")
	delete_item_id = id
	show_dialog("delete-item-dialog")
}

function delete_item_confirmed() {
	send_delete_item(delete_item_id, () => {
		window.location.reload()
	})
	delete_item_id = ""
}

var delete_category_name = ""
function delete_category_clicked(item) {
	var name = item.parentNode.parentNode.getAttribute("category_name")
	delete_category_name = name
	show_dialog("delete-category-dialog")
}

function delete_category_confirmed() {
	send_delete_category(delete_category_name, () => {
		window.location.reload()
	})
	delete_category_name = ""
}

var delete_type_name = ""
var delete_type_category = ""
function delete_type_clicked(item) {
	var name = item.parentNode.parentNode.getAttribute("type_name")
	console.log(item.parentNode.parentNode.parentNode.previousElementSibling)
	var category = item.parentNode.parentNode.parentNode.previousElementSibling.getAttribute("category_name")
	delete_type_name = name
	delete_type_category = category
	show_dialog("delete-type-dialog")
}

function delete_type_confirmed() {
	send_delete_type(delete_type_name, delete_type_category, () => {
		window.location.reload()
	})
	delete_type_name = ""
	delete_type_category = ""
}

function enter_delete_mode() {
	$(".fa-trash-can").css("display", "inline-block")
	$('#enter-delete-mode-btn').css("display", "none")
	$('#exit-delete-mode-btn').css("display", "inline-block")
}

function exit_delete_mode() {
	$(".fa-trash-can").css("display", "none")
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function print_barcode() {
	var inner = $('#barcode-container')[0].outerHTML
	popupWinindow = window.open('', '_blank', 'width=1000,height=1000,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no')
	popupWinindow.document.open()
	popupWinindow.document.write('<html><head><style></style></head><body onload="window.print()">' + inner + '</html>')
	popupWinindow.document.close()
}

function print_qrcode() {
	var inner = $('#qrcode-container')[0].outerHTML
	popupWinindow = window.open('', '_blank', 'width=1000,height=1000,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no')
	popupWinindow.document.open()
	popupWinindow.document.write('<html><head><style></style></head><body onload="window.print()">' + inner + '</html>')
	popupWinindow.document.close()

}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}

function setup_item_dropdown() {
	$("button.collapsible").on("click", (e) => {
		if (e.target.tagName != "BUTTON")
			return

		var content = e.target.nextElementSibling
		var already_open = !!content.style.maxHeight
		$('.collapsible.active').removeClass('active')

		if (e.target.classList.contains("type"))
			$(".collapsible-content.type").css("maxHeight", "")
		else
			$(".collapsible-content").css("maxHeight", "")

		if (already_open){
			content.style.maxHeight = null;
		} else {
			//content.style.maxHeight = content.scrollHeight + "px";
			e.target.classList.toggle("active")
			content.style.maxHeight = "unset";
		}
	})
}
