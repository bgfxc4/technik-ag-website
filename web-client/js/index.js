window.onload = function () {
	
	var search_keyword = new URL(window.location).searchParams.get("search")
	
	if (search_keyword != null) {
		$("#search-message").text(`Search results for "${search_keyword}"`)
		$("#top-bar input").val(search_keyword)
	}

	var equipment = request_equipment()
	render_equipment(equipment, search_keyword)
}

function render_equipment(equipment, search_keyword) {
	$("#equipment-container").html("")
	var outer = ""
	for (var category of equipment) {
		var inner = ""
		for (var item of category.equipment) {
			if (!item.name.includes(decodeURIComponent(search_keyword)) && search_keyword !== null)
				continue
			inner += `<div class="item-entry"><img src="data:image/jpeg;base64,${item.image}"/>` + 
						`<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>` +
						`<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id}</div></div>`
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

function setup_item_dropdown() {
	$(".collapsible").on("click", (e) => {
		e.target.classList.toggle("active")
		var content = e.target.nextElementSibling
		if (content.style.maxHeight){
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = content.scrollHeight + "px";
		}
	})
}
