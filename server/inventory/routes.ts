import * as db_helper from "./db_helper"
import * as main from "../main"
import * as storage_db_helper from "../storage/db_helper"

export interface Equipment {
	id: string;
	name: string;
	description: string;
	room: string;
	shelf: string;
	compartment: string;
	category: string;
	type: string;
	image: string;
	custom_fields: any;
}

export interface Category {
	name: string;
	image: string;
	types: string[];
	custom_fields: string[];
}

main.app.post("/authorize", (req, res) => {
	if (!main.authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	return res.send("Ok")
})

main.app.post("/new-equipment", async (req, res) => {
	if (!main.check_request(['name', 'description', 'room', 'shelf', 'compartment', 'category', 'type'], true, req.body, res))
		return
	
	var shelf_exists = false
	await storage_db_helper.compartment_exists(req.body.room, req.body.shelf, req.body.compartment, exists => {
		shelf_exists = exists
		if (!exists)
			res.status(400).send("The room, shelf or compartment you specified does not exist!")
	})
	if (!shelf_exists)
		return

	db_helper.check_if_type_exists(req.body.category, req.body.type, code => {
		if (code == 1)
			return res.status(400).send("The category you specified does not exist!")
		if (code == 2)
			return res.status(400).send("The type you specified does not exist in the category you specified!")
		db_helper.add_equipment_to_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/new-category", (req, res) => {
	if (!main.check_request(['name'], true, req.body, res))
		return

	db_helper.add_category_to_db(req.body, exists => {
		if (!exists)
			res.status(200).send("ok")
		else
			res.status(400).send("A category with this name exists already!")
	})
})

main.app.post("/new-type", (req, res) => {
	if (!main.check_request(['name', 'category'], true, req.body, res))
		return

	db_helper.add_type_to_db(req.body, code => {
		if (code == 0)
			res.status(200).send("ok")
		else if (code == 1)
			res.status(400).send("The category you specified does not exist!")
		else
			res.status(400).send("A type with this name exists already in this category!")
	})
})

main.app.post("/edit-equipment", async (req, res) => {
	if (!main.check_request(['id', 'name', 'description', 'room', 'shelf', 'compartment', 'category', 'type'], true, req.body, res))
		return
	
	var storage_exists = false
	await storage_db_helper.compartment_exists(req.body.room, req.body.shelf, req.body.compartment, exists => {
		storage_exists = exists
		if (!exists)
			return res.status(400).send("The room, shelf or compartment you specified does not exist!")
	})
	if (!storage_exists)
		return

	db_helper.check_if_type_exists(req.body.category, req.body.type, code => {
		if (code == 1)
			return res.status(400).send("The category you specified does not exist!")
		if (code == 2)
			return res.status(400).send("The type you specified does not exist in the category you specified!")
		db_helper.edit_equipment_in_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/edit-type", (req, res) => {
	if (!main.check_request(['old_name', 'category'], true, req.body, res))
		return

	db_helper.check_if_type_exists(req.body.category, req.body.old_name, exists => {
		if (exists != 0)
			return res.status(400).send("A type with the old_name you specified does not exist in the category you specified!")
		db_helper.edit_type_in_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/edit-category", (req, res) => {
	if (!main.check_request(['old_name'], true, req.body, res))
		return

	db_helper.check_if_category_exists(req.body.old_name, exists => {
		if (!exists)
			return res.status(400).send("A category with the old_name you specified does not exist!")
		db_helper.edit_category_in_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/delete-equipment", (req, res) => {
	if (!main.check_request(['id'], true, req.body, res))
		return

	db_helper.delete_equipment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/delete-category", (req, res) => {
	if (!main.check_request(['name'], true, req.body, res))
		return

	db_helper.check_if_category_exists(req.body.name, exists => {
		if (!exists)
			return res.status(400).send("The category you specified does not exist!")
		db_helper.delete_category_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/delete-type", (req, res) => {
	if (!main.check_request(['name', 'category'], true, req.body, res))
		return

	db_helper.check_if_type_exists(req.body.category, req.body.name, code => {
		if (code != 0)
			return res.status(400).send("The type or category you specified does not exist!")
		db_helper.delete_type_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.get("/get-equipment", (req, res) => {
	db_helper.get_equipment_from_db(list => {
		db_helper.get_categories_from_db(cats => {
			var result: any[] = []

			for (var cat of cats) {
				var types = []
				
				for (var t of cat.types)
					types.push({name: t, equipment: []})

				result.push({name: cat.name, types: types, custom_fields: cat.custom_fields})
			}

			for (var equ of list) {
				for (var i = 0; i < result.length; i++) {
					if (result[i].name == equ.category) {
						for (var j = 0; j < result[i].types.length; j++) {
							if (result[i].types[j].name == equ.type) {
								result[i].types[j].equipment.push(equ)
								continue
							}
						}
						continue
					}
				}
			}
			res.send(JSON.stringify(result))
		})
	})
})

main.app.get("/get-category-img/:name", (req, res) => {
	if (!main.check_request(['name'], false, req.params, res))
		return

	db_helper.get_category_by_name(req.params.name, cat => {
		if (cat == undefined)
			return res.status(400).send("A category with the name you provided does not exist!")
		
		var img = Buffer.from(cat.image, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length
		});

		res.end(img)
	})
})

main.app.get("/get-item-img/:id", (req, res) => {
	if (!main.check_request(['id'], false, req.params, res))
		return

	db_helper.get_equipment_by_id_from_db(req.params.id, equ => {
		if (equ == undefined || equ.length == 0 || equ[0] == undefined)
			return res.status(400).send("An item with the id you provided does not exist!")
		var img = Buffer.from(equ[0].image, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length
		});

		res.end(img)
	}, {})
})

function fits_search(name: string, keywords: any[]) {
	for (var k of keywords) {
		if (name.toLowerCase().includes(k.toLowerCase()))
			return true
	}
	return false
}

main.app.post("/search-equipment", (req, res) => {
	if (!req.body.keywords || !req.body.keywords[0])
		return res.status(400).send("You have to provide keywords to search for!")

	db_helper.get_equipment_from_db(list => {
		var ret:any[] = []
		for (var item of list) {
			if (fits_search(item.name, req.body.keywords))
				ret.push(item)
		}
		res.send(JSON.stringify(ret))
	})
})

main.app.get("/get-categories", (req, res) => {
	db_helper.get_categories_from_db(list => {
		res.send(JSON.stringify(list))
	})
})

main.app.get("/get-equipment-by-id/:id", (req, res) => {
	if (!main.check_request(['id'], false, req.params, res))
		return

	db_helper.get_equipment_by_id_from_db(req.params.id, list => {
		var result: any[] = []
		for (var equ of list) {
			var category_exists = false
			for (var cat of result) {
				if (cat.name == equ.category) {
					category_exists = true
					cat.equipment.push(equ)
				}
			}
			if (!category_exists) {
				result.push({
					name: equ.category,
					equipment: [equ]
				})
			}
		}
		res.send(JSON.stringify(result))
	})
})

main.app.get("/get-equipment-by-type/:category/:type", (req, res) => {
	if (!main.check_request(['category', 'type'], false, req.params, res))
		return

	db_helper.get_equipment_by_type_from_db(req.params.category, req.params.type, equ => {
		res.send(JSON.stringify(equ))
	})
})
