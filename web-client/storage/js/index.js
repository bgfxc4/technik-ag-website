var logged_in = false

window.onload = function () {

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	request_storage(stor => {
		if (stor === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_storage(stor)
	})

	$('[data-bs-toggle="popover"]').popover({
		trigger: "focus",
		html: true,
		sanitize: false
	})
}

function render_storage(stor) {
	var room_actions = `
		<button class="edit_btn" onclick="edit_room_clicked(this)"><i class="fa-solid fa-pen fa-l" style="color:blue;"></i></button>
		<button class="delete_btn" onclick="delete_room_clicked(this)"><i class="fa-solid fa-trash-can fa-l" style="color:red;"></i></button>
	`
	var shelf_actions = `
		<button class="edit_btn" onclick="edit_shelf_clicked(this)"><i class="fa-solid fa-pen fa-l" style="color:blue;"></i></button>
		<button class="delete_btn" onclick="delete_shelf_clicked(this)"><i class="fa-solid fa-trash-can fa-l" style="color:red;"></i></button>
	`

	$('#room_list').html(`<li><button class="new-room admin-only" onclick="show_dialog('create-room-dialog')">New room</button></li>`)
	console.log(stor)
	for (var r of stor) {
		var shelfs = ""
		for (var s of r.shelfs) {
			compartments = get_compartments_html(s, r.name)
			shelfs += `<li shelf_name="${s.name}" room_name="${r.name}"><span class="caret">${s.name}</span>${shelf_actions}
				<ul class="nested">
					${compartments}
					<li><button class="new-compartment admin-only" onclick="compartment_create_room='${r.name}';compartment_create_shelf='${s.name}';show_dialog('create-compartment-dialog')">New compartment</button></li>
				</ul>
			</li>`
		}

		$('#room_list').prepend(`<li room_name="${r.name}"><span class="caret">${r.name}</span>${room_actions}
				<ul class="nested">
					${shelfs}
					<li><button class="new-shelf admin-only" onclick="shelf_create_room='${r.name}';show_dialog('create-shelf-dialog')">New shelf</button></li>
				</ul>
			</li>`)
	}
	setup_list()
}

function get_compartments_html(shelf, room_name) {
	var compartment_actions = `
		<button class="edit_btn" onclick="edit_compartment_clicked(this)"><i class="fa-solid fa-pen fa-l" style="color:blue;"></i></button>
		<button class="delete_btn" onclick="delete_compartment_clicked(this)"><i class="fa-solid fa-trash-can fa-l" style="color:red;"></i></button>
	`
	ret = ""
	for (var comp of shelf.compartments) {
		ret += `<li compartment_name="${comp.name}" shelf_name="${shelf.name}" room_name="${room_name}"><span>‣${comp.name}</span>${compartment_actions}
		</li>`

	}
	return ret
}

function search() {
	var keyword = $(".search-form input").val()
	window.location = "../search/" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
	return false
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

var compartment_create_room = ""
var compartment_create_shelf = ""
function create_compartment_confirmed() {
	send_create_compartment($('#create-compartment-name').val(), compartment_create_shelf, compartment_create_room, res => {
		if (res.status != 200) {
			show_error_message(res.responseText)
		} else {
			request_storage(stor => {
				if (stor === undefined) {
					return show_error_message("Not able to connect to the server. Please contact the system administrator.")
				}
				render_storage(stor)
			})
		}
	})
	hide_all_dialogs()
	$('#create-compartment-name').val("")
}

var shelf_create_room = ""
function create_shelf_confirmed() {
	send_create_shelf($('#create-shelf-name').val(), shelf_create_room, res => {
		if (res.status != 200) {
			show_error_message(res.responseText)
		} else {
			request_storage(stor => {
				if (stor === undefined) {
					return show_error_message("Not able to connect to the server. Please contact the system administrator.")
				}
				render_storage(stor)
			})
		}
	})
	hide_all_dialogs()
	$('#create-shelf-name').val("")
}

function create_room_confirmed() {
	send_create_room($('#create-room-name').val(), res => {
		if (res.status != 200) {
			show_error_message(res.responseText)
		} else {
			request_storage(stor => {
				if (stor === undefined) {
					return show_error_message("Not able to connect to the server. Please contact the system administrator.")
				}
				render_storage(stor)
			})
		}
	})
	hide_all_dialogs()
	$('#create-room-name').val("")
}

var delete_room_name = ""
function delete_room_clicked(item) {
	delete_room_name = $(item).parent().attr("room_name")
	show_dialog("delete-room-dialog")
}

var delete_shelf_room = ""
var delete_shelf_name = ""
function delete_shelf_clicked(item) {
	delete_shelf_room = $(item).parent().attr("room_name")
	delete_shelf_name = $(item).parent().attr("shelf_name")
	show_dialog("delete-shelf-dialog")
}

var delete_compartment_room = ""
var delete_compartment_shelf = ""
var delete_compartment_name = ""
function delete_compartment_clicked(item) {
	delete_compartment_room = $(item).parent().attr("room_name")
	delete_compartment_shelf = $(item).parent().attr("shelf_name")
	delete_compartment_name = $(item).parent().attr("compartment_name")
	show_dialog("delete-compartment-dialog")
}

function delete_room_confirmed() {
	send_delete_room(delete_room_name, res => {
		if (res.status != 200) {
			show_error_message(res.responseText)
		} else {
			request_storage(stor => {
				if (stor === undefined) {
					return show_error_message("Not able to connect to the server. Please contact the system administrator.")
				}
				render_storage(stor)
				enter_delete_mode()
			})
		}
	})
	hide_all_dialogs()
}

function delete_shelf_confirmed() {
	send_delete_shelf(delete_shelf_name, delete_shelf_room, res => {
		if (res.status != 200) {
			show_error_message(res.responseText)
		} else {
			request_storage(stor => {
				if (stor === undefined) {
					return show_error_message("Not able to connect to the server. Please contact the system administrator.")
				}
				render_storage(stor)
				enter_delete_mode()
			})
		}
	})
	hide_all_dialogs()
}

function delete_compartment_confirmed() {
	send_delete_compartment(delete_compartment_name, delete_compartment_shelf, delete_compartment_room, res => {
		if (res.status != 200) {
			show_error_message(res.responseText)
		} else {
			request_storage(stor => {
				if (stor === undefined) {
					return show_error_message("Not able to connect to the server. Please contact the system administrator.")
				}
				render_storage(stor)
				enter_delete_mode()
			})
		}
	})
	hide_all_dialogs()
}

function edit_room_clicked(item) {
	//TODO
}

function edit_shelf_clicked(item) {
	//TODO
}

function enter_delete_mode() {
	exit_edit_mode()
	$('.delete_btn').css("display", "inline-block")
	$('#enter-delete-mode-btn').css("display", "none")
	$('#exit-delete-mode-btn').css("display", "inline-block")
}

function exit_delete_mode() {
	$('.delete_btn').css("display", "none")
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function enter_edit_mode() {
	exit_delete_mode()
	$('.edit_btn').css("display", "inline-block")
	$('#enter-edit-mode-btn').css("display", "none")
	$('#exit-edit-mode-btn').css("display", "inline-block")
}

function exit_edit_mode() {
	$('.edit_btn').css("display", "none")
	$('#enter-edit-mode-btn').css("display", "inline-block")
	$('#exit-edit-mode-btn').css("display", "none")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}

function setup_list() {
	var toggler = document.getElementsByClassName("caret")
	for (var i = 0; i < toggler.length; i++) {
		toggler[i].addEventListener("click", function() {
			this.parentElement.querySelector(".nested").classList.toggle("active")
			this.classList.toggle("caret-down")
		})
	}
}
