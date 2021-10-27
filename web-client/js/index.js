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
		var inner = ""
		for (var item of category.equipment) {
			if (!item.name.toLowerCase().includes(decodeURIComponent(search_keyword).toLowerCase()) && search_keyword !== null)
				continue
			if (inner != "")
				inner += "<hr>"
			
			var actions = `<div class="actions admin-only" ${logged_in ? '' : 'style="visibility: hidden;'}">
							<button onclick="gencode_clicked(this)"><i class="fa-solid fa-barcode fa-2xl"></i></button>
							<button onclick="window.location = './edit-item?id=${item.id}'"><i class="fa-solid fa-pen fa-2xl"></i></button>
							<button onclick="delete_clicked(this)"><i class="fa-solid fa-trash-can fa-2xl" style="color:red;"></i></button>
						</div>`

			inner += `<div class="item-entry" item_id="${item.id}"><img onclick="window.location = './item?id=${item.id}'" src="data:image/jpeg;base64,${item.image}"/>
						<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>
						<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id}</div>${actions}</div>`
		}
		//if (inner != "")
			outer += `<button type="button" class="collapsible">${category.name}</button>  <div class="collapsible-content">${inner}</div>`
	}
	$("#equipment-container").append(outer)
	setup_item_dropdown()
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
	$(".collapsible").on("click", (e) => {
		e.target.classList.toggle("active")
		var content = e.target.nextElementSibling
		if (content.style.maxHeight){
			content.style.maxHeight = null;
		} else {
			//content.style.maxHeight = content.scrollHeight + "px";
			content.style.maxHeight = "unset";
		}
	})
}
