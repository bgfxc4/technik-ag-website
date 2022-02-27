var logged_in = false
var cat_name = ""

window.onload = function () {

	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
	
	cat_name = new URL(window.location).searchParams.get("category")
	
	if (cat_name == null) {
		window.location = "../"
	}
	
	render_path_text()

	request_categories(cats => {
		if (cats === undefined) {
			return show_error_message("Not able to connect to the server. Please contact the system administrator.")
		}
		render_types(cats, cat_name)
	})

	$('[data-bs-toggle="popover"]').popover({
		trigger: "focus",
		html: true,
		sanitize: false
	})
}

function render_types(cats, cat_name) {
	var s = ""
	for (var category of cats) {
		if (category.name == decodeURIComponent(cat_name)) {
			for (var t of category.types) {
				var loc = '../type/?category=' + cat_name + '&type=' + encodeURIComponent(t)
				s += `<button class="type-btn" id="${t.replaceAll(" ", "_")}-btn" type_name="${t}" onclick="window.location = '${loc}'">
						<div><h2>${t}</h2> <br> </div>
					</button>`

				request_equipment_by_type(decodeURIComponent(cat_name), t, res => {
					if (res.length == 0) 
						return
					var items = ""
					for (var i of res) {
						console.log(i)
						items += `<a href='../item/?id=${encodeURIComponent(i.id)}&category=${encodeURIComponent(category.name)}&type=${encodeURIComponent(t)}'>${i.name}</a><br>`
					}
					console.log(items)
					$(`#${res[0].type.replaceAll(" ", '_')}-btn div`).append(items)
				})
			}
		}
	}
	$("#equipment-container").prepend(s)
}

function render_path_text() {
	$('#path-text').html(`<nav aria-label="breadcrumb">
			<ol class="breadcrumb">
				<li class="breadcrumb-item"><a href='../'>Inventory</a></li>
				<li class="breadcrumb-item active" aria-current="page">${cat_name}</li>
			</ol>
		</nav>`)
}

function search() {
	var keyword = $(".search-form input").val()
	window.location = "../../search/" + ((keyword == "") ? "" : "?search=" + encodeURIComponent(keyword))
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

function edit_type_clicked(item) {
	var name = item.getAttribute("type_name")
	window.location = `../../edit/type?name=${encodeURIComponent(name)}&cat=${cat_name}`
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
	$('.type-btn').each((i, el) => {
		$(el).attr('onclick', $(el).attr('onclick-tmp'))
	})
	$('#enter-delete-mode-btn').css("display", "inline-block")
	$('#exit-delete-mode-btn').css("display", "none")
}

function enter_edit_mode() {
	exit_delete_mode()
	$('.type-btn').addClass('blue-btn')
	$('.type-btn').each((i, el) => {
		$(el).attr('onclick-tmp', $(el).attr('onclick'))
		$(el).attr('onclick', 'edit_type_clicked(this)')
	})
	$('#enter-edit-mode-btn').css("display", "none")
	$('#exit-edit-mode-btn').css("display", "inline-block")
}

function exit_edit_mode() {
	$('.type-btn').removeClass('blue-btn')
	$('.type-btn').each((i, el) => {
		$(el).attr('onclick', $(el).attr('onclick-tmp'))
	})
	$('#enter-edit-mode-btn').css("display", "inline-block")
	$('#exit-edit-mode-btn').css("display", "none")
}

function show_error_message(msg) {
	$('#error-msg').text(msg)
	$('#error-msg').css("visibility", "visible")
}
