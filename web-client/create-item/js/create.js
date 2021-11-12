var categories = []
var complete_equipment = []

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()

	request_categories(res => {
		categories = res
		for (var cat of res) {
			$('#create-item-category').append(`<option onclick="render_types(${cat.name})" value="${cat.name}">${cat.name}</option>`)
		}
		if (res[0] != undefined)
			render_types(res[0].name)
	})

	request_equipment(res => {
		complete_equipment = res
		render_template_list(res)
	})
}

function render_types(cat_name) {
	$('#create-item-type').html("")
	$('#custom-field-container').html("")
	for (var cat of categories) {
		if (cat_name == cat.name) {
			for (var t of cat.types)
				$('#create-item-type').append(`<option value="${t}">${t}</option>`)
			for (var f of cat.custom_fields)
				$('#custom-field-container').append(`<label for="custom-field-${f}">${f}:</label><br><input type="text" field-name="${f}" placeholder="Enter a value for ${f}..." id="custom-field-${f}"><br>`)
			return
		}
	}
}

function fill_in_item(item) {
	$('#create-item-name').val(item.name + " - copy")
	$('#create-item-description').val(item.description)
	$('#create-item-storage').val(item.storage_place)
	$('#create-item-category').val(item.category).change()
	render_types(item.category)
	$('#create-item-type').val(item.type).change()
	$('#create-image-preview')[0].src = `data:image/jpeg;base64,${item.image}`
}

function render_template_list(equipment) {
	var str = ""
	for (var i = 0; i < equipment.length; i++) {
		var c = ""
		for (var j = 0; j < equipment[i].types.length; j++) {
			var t = ""
			for (var k = 0; k < equipment[i].types[j].equipment.length; k++) {
				t += `<li><a onclick="fill_in_item(complete_equipment[${i}].types[${j}].equipment[${k}])" href="#" class="item-template">${equipment[i].types[j].equipment[k].name}</a></li>`
			}
			c += `<li><a href="#">${equipment[i].types[j].name}</a><ul>${t}</ul></li>`
		}
		str += `<li><a href="#">${equipment[i].name}</a><ul>${c}</ul></li>`
	}
	
	$('#template-tree .tree').html(str)

	var tree = document.querySelectorAll('ul.tree a:not(:last-child)');
	for(var i = 0; i < tree.length; i++){
		tree[i].addEventListener('click', function(e) {
			var parent = e.target.parentElement;
			var classList = parent.classList;
			if(classList.contains("open")) {
				classList.remove('open');
				var opensubs = parent.querySelectorAll(':scope .open');
				for(var i = 0; i < opensubs.length; i++){
					opensubs[i].classList.remove('open');
				}
			} else {
				classList.add('open');
			}
			e.preventDefault();
		});
	}
}

function create_item_clicked() {
	var custom_fields = {}
	$("#custom-field-container input").each((i, el) => {
		custom_fields[$(el).attr('field-name')] = $(el).val()
	})

	load_image_base64("#create-item-image", img => {
		var item = {
			name: $('#create-item-name').val(),
			description: $('#create-item-description').val(),
			storage_place: $('#create-item-storage').val(),
			category: $('#create-item-category').val(),
			type: $('#create-item-type').val(),
			custom_fields: custom_fields,
			image: img
		}
		send_create_item(item, res => {
			if (res.status != 200) {
				display_error(`${res.status}: ${res.responseText}`)
			} else {
				window.location = '../'
			}
		})
	})
}

function display_error(msg) {
	$('#error-text').text(msg)
}

function load_image_preview(input_query, img_query) {
	load_image_base64(input_query, img => {
		$(img_query)[0].src = `data:image/jpeg;base64,${img}`
	})
}

function load_image_base64(query, callback) {
	if ($(query)[0].files.length == 0) {
		callback(undefined)
		return
	}
	var file = $(query)[0].files[0]
	var reader = new FileReader()
	reader.onloadend = function() {
		callback(reader.result.split('base64,')[1])
	}
	reader.readAsDataURL(file)
}
