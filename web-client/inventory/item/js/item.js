var logged_in = false
var qrcode

var item_id = ""
var cat_name = ""
var type_name = ""

window.onload = function () {
	qrcode = new QRCode("qrcode-container")

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	item_id = new URL(window.location).searchParams.get("id")
	cat_name = new URL(window.location).searchParams.get("category")
	type_name = new URL(window.location).searchParams.get("type")

	if (cat_name && type_name && item_id) {
		render_path_text()
	}

	if (item_id == null || item_id == "") {
		window.location = "../"
	}

	request_equipment_by_id(item_id, equipment => {
		if (equipment === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_equipment(equipment)
	})

	$('[data-bs-toggle="popover"]').popover({
		trigger: "focus",
		html: true,
		sanitize: false
	})
}

function render_equipment(equipment) {
	$("#equipment-container").html("")
	var inner = ""
	for (var category of equipment) {
		for (var item of category.equipment) {
			
			var actions = `<div class="actions admin-only" style="visibility: hidden;">
							<button onclick="gencode_clicked(this)"><i class="fa-solid fa-barcode fa-2xl"></i></button>
							<button><i class="fa-solid fa-pen fa-2xl"></i></button>
							<button onclick="delete_clicked(this)"><i class="fa-solid fa-trash-can fa-2xl" style="color:red;"></i></button>
						</div>`

			var cf = ""
			for (var f in item.custom_fields) {
				cf += `<br><b>${f}:</b> ${item.custom_fields[f]}`
			}
			var img = `<img src="${server_url}get-item-img/${item.id}"/>`
			var storage = `${item.room} - ${item.shelf} - ${item.compartment}`
			inner += `<div class="item-entry" item_id="${item.id}">${img}
						<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>
						<b>Storage:</b> ${storage}<br><b>ID:</b> ${item.id} ${cf}</div>${actions}</div>`
		}
	}
	$("#equipment-container").append(inner)
}

function render_path_text() {
	$('#path-text').html(`<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href='../'>Inventory</a></li>
				<li class="breadcrumb-item"><a href='../category?category=${cat_name}'>${cat_name}</a></li>
				<li class="breadcrumb-item"><a href='../type?category=${cat_name}&type=${type_name}''>${type_name}</a></li>
				<li class="breadcrumb-item active" aria-current="page">${item_id}</li>
			</ol>
		</nav>`)
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

function search() {
	var keyword = $(".search-form input").val()
	window.location = "../../search/" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
	return false
}

var code_id = ""
function gencode_clicked(e) {	
	var id = e.parentNode.parentNode.getAttribute("item_id")
	code_id = id
	qrcode.makeCode(id)
	JsBarcode("#barcode-container", id.substring(0, 23), {
		width: 1,
		height: 50
	})
	show_dialog("qrcode-dialog")
}

function create_item_clicked() {
	var item = {
		name: $('#create-item-name').val(),
		description: $('#create-item-description').val(),
		storage_place: $('#create-item-storage').val(),
		category: $('#create-item-category').val()
	}
	send_create_item(item, () => {
		window.location.reload()
	})
}

var delete_id = ""
function delete_clicked(item) {
	var id = item.parentNode.parentNode.getAttribute("item_id")
	delete_id = id
	show_dialog("delete-item-dialog")
}

function delete_item_clicked() {
	send_delete_item(delete_id, () => {
		window.location.reload()
	})
	delete_id = ""
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
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
