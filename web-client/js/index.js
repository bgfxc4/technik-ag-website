window.onload = function () {

	var equipment = request_equipment()
	render_equipment(equipment)
}

function render_equipment(equipment) {
	var outer = ""
	for (var category of equipment) {
		var inner = ""
		for (var item of category.equipment) {
			inner += `<div class="item-entry"><img src="data:image/jpeg;base64,${item.image}"/>` + 
						`<div class="description"><b>Name:</b> ${item.name} <br> <b>Description:</b> ${item.description}<br>` +
						`<b>Storage:</b> ${item.storage_place}<br><b>ID:</b> ${item.id}</div></div>`
		}
		outer += `<button type="button" class="collapsible">${category.name}</button>  <div class="collapsible-content">${inner}</div>`
	}
	$("#equipment-container").append(outer)
	setup_item_dropdown()
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
