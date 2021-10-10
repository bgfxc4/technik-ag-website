var logged_in = false

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	var search_keyword = new URL(window.location).searchParams.get("search")
	
	if (search_keyword != null) {
		$("#search-message").text(`Search results for "${search_keyword}"`)
		$("#top-bar input").val(search_keyword)
		$("#top-bar button.x").css("display", "block")
	}

	var equipment = request_equipment()
	render_equipment(equipment, search_keyword)
}

function render_equipment(equipment, search_keyword) {
	$("#equipment-container").html("")
	var outer = ""
	for (var category of equipment) {
		$("#create-item-category-list").append(`<option value="${category.name}">`)
		var inner = ""
		for (var item of category.equipment) {
			if (!item.name.toLowerCase().includes(decodeURIComponent(search_keyword).toLowerCase()) && search_keyword !== null)
				continue
			if (inner != "")
				inner += "<hr>"
			
			var actions = `<div class="actions admin-only" style="visibility: hidden;">
							<button><i class="fa-solid fa-barcode fa-2xl"></i></button>
							<button><i class="fa-solid fa-pen fa-2xl"></i></button>
							<button><i class="fa-solid fa-trash-can fa-2xl" style="color:red;"></i></button>
						</div>`

			inner += `<div class="item-entry"><img src="data:image/jpeg;base64,${item.image}"/>
						<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>
						<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id}</div>${actions}</div>`
		}
		if (inner != "")
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

function check_if_logged_in() {
	var login_hash = get_cookie("login_hash")
	if (login_hash != "") {
		var xhr = new XMLHttpRequest()
		var url = server_url + "authorize"
		xhr.onload = function() {
			if (xhr.status == 200) {
				logged_in = true
				$("#logged-in").css("display", "inline")
				$("#not-logged-in").css("display", "none")
				$(".admin-only").css("visibility", "visible")
			}
		}
		xhr.open("POST", url)
		xhr.setRequestHeader("content-type", "application/json")
		xhr.send(JSON.stringify({login_hash: login_hash}))
	}
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
