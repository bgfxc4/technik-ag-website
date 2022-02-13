var categories = []
var complete_equipment = []

var cat_name = ""
var type_name = ""

var storage_obj

var room = ""
var shelf = ""

window.onload = function () {
	$(".admin-only").css("visibility", "hidden")
	check_if_logged_in()
	
	cat_name = new URL(window.location).searchParams.get("category")
	type_name = new URL(window.location).searchParams.get("type")

	request_categories(res => {
		categories = res
		for (var cat of res) {
			$('#create-item-category').append(`<option onclick="render_types(${cat.name})" value="${cat.name}">${cat.name}</option>`)
		}
		if (cat_name != null) {
				$('#create-item-category').val(decodeURIComponent(cat_name))
				$('#create-item-category').select()
				render_types(decodeURIComponent(cat_name))
			if (type_name != null) {
				$('#create-item-type').val(decodeURIComponent(type_name))
				$('#create-item-type').select()
			}
		} else if (res[0] != undefined)
			render_types(res[0].name)
	})

	request_equipment(res => {
		complete_equipment = res
		render_template_list(res)
	})

	request_storage(res => {
		storage_obj = res
		render_storage(res)
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

function render_storage(stor) {
	$('#create-item-storage-room').html("")
	$('#create-item-storage-shelf').html("")
	$('#create-item-storage-compartment').html("")
	for (var r of stor) {
		$('#create-item-storage-room').append(`<option value="${r.name}">${r.name}</option>`)
	}
	if (!stor[0])
		return
	room = stor[0].name
	for (var s of stor[0].shelfs) {
		$('#create-item-storage-shelf').append(`<option value="${s.name}">${s.name}</option>`)
	}
	shelf = stor[0].shelfs[0].name
	if (!stor[0].shelfs[0])
		return
	for (var c of stor[0].shelfs[0].compartments) {
		$('#create-item-storage-comaprtment').append(`<option value="${c.name}">${c.name}</option>`)
	}
}

function render_shelfs(room_name) {
	$('#create-item-storage-shelf').html("")
	$('#create-item-storage-compartment').html("")
	for (var r of storage_obj) {
		if (room_name == r.name) {
			room = room_name
			if (r.shelfs[0])
				shelf = r.shelfs[0].name
			for (var s of r.shelfs)
				$('#create-item-storage-shelf').append(`<option value="${s.name}">${s.name}</option>`)
			if (r.shelfs[0])
				render_comps(r.shelfs[0].name)
		}
	}
}

function render_comps(shelf_name) {
	$('#create-item-storage-compartment').html("")
	for (var r of storage_obj) {
		if (room == r.name) {
			for (var s of r.shelfs) {
				if (s.name == shelf_name) {
					shelf = shelf_name
					for (var c of s.compartments) {
						$('#create-item-storage-compartment').append(`<option value="${c.name}">${c.name}</option>`)
					}
					return
				}
			}
		}
	}
}

function fill_in_item(item) {
	$('#create-item-name').val(item.name + " - copy")
	$('#create-item-description').val(item.description)
	
	$('#create-item-storage-room').val(item.room).change()
	$('#create-item-storage-shelf').val(item.shelf).change()
	$('#create-item-storage-compartment').val(item.compartment).change()

	$('#create-item-category').val(item.category).change()
	render_types(item.category)
	for (var i in item.custom_fields) {
		$(`#custom-field-${i}`).val(item.custom_fields[i])
	}
	$('#create-item-type').val(item.type).change()

	url_to_base64(`${server_url}get-item-img/${item.id}`, b => {
		$('#create-image-preview')[0].src = `${b}`
	})
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

	var item = {
		name: $('#create-item-name').val(),
		description: $('#create-item-description').val(),
		room: $('#create-item-storage-room').val(),
		shelf: $('#create-item-storage-shelf').val(),
		compartment: $('#create-item-storage-compartment').val(),
		category: $('#create-item-category').val(),
		type: $('#create-item-type').val(),
		custom_fields: custom_fields,
		image: (!!$('#create-image-preview')[0].src) ? $('#create-image-preview')[0].src.split('base64,')[1] : undefined
	}
	send_create_item(item, res => {
		if (res.status != 200) {
			display_error(`${res.status}: ${res.responseText}`)
		} else {
			window.location = '../../inventory'
		}
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

function url_to_base64(url, callback) {
	var xhr = new XMLHttpRequest()
	xhr.onload = function() {
		var reader = new FileReader()
		reader.onloadend = function() {
			callback(reader.result)
		}
		reader.readAsDataURL(xhr.response)
	}
	xhr.open('GET', url)
	xhr.responseType = 'blob'
	xhr.send()
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
