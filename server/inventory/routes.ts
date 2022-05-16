import * as db_helper from "./db_helper"
import * as main from "../main"
import * as storage_db_helper from "../storage/db_helper"
import {PERMS} from "../permissions"

export interface Equipment {
	id: string;
	name: string;
	description: string;
	room: string;
	shelf: string;
	compartment: string;
	category: string;
	type: string;
	amount: number;
	image: string;
	custom_fields: any;
}

export interface Category {
	name: string;
	image: string;
	types: string[];
	custom_fields: string[];
}

main.app.post("/equipment/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"description": "string",
			"room": "string",
			"shelf": "string",
			"compartment": "string",
			"category": "string",
			"type": "string",
			"amount": "number",
			"custom_fields": "object",
			"image": "string",
			"id": "string"
		},
		required: ["name", "description", "room", "shelf", "compartment", "category", "type", "amount"]
	}
	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
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

var custom_field_type: main.bodyType = {
	fields: {
		"name": "string",
		"type": "string",
		"options": main.array("string")
	},
	required: ["name", "type"]
}

main.app.post("/category/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"custom_fields": main.array(custom_field_type),
			"image": "string"
		},
		required: ["name"]
	}
	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
		return

	db_helper.add_category_to_db(req.body, exists => {
		if (!exists)
			res.status(200).send("ok")
		else
			res.status(400).send("A category with this name exists already!")
	})
})

main.app.post("/type/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"category": "string"
		},
		required: ["name", "category"]
	}
	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
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

main.app.post("/equipment/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"id": "string",
			"name": "string",
			"description": "string",
			"room": "string",
			"shelf": "string",
			"compartment": "string",
			"category": "string",
			"type": "string",
			"amount": "number",
			"custom_fields": "object",
			"image": "string"
		},
		required: ["id", "name", "description", "room", "shelf", "compartment", "category", "type", "amount"]
	}
	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
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

main.app.post("/type/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"old_name": "string",
			"new_name": "string",
			"category": "string"
		},
		required: ["old_name", "new_name", "category"]
	}
	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
		return

	db_helper.check_if_type_exists(req.body.category, req.body.old_name, exists => {
		if (exists != 0)
			return res.status(400).send("A type with the old_name you specified does not exist in the category you specified!")
		db_helper.edit_type_in_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/category/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"old_name": "string",
			"new_name": "string",
			"image": "string",
			"custom_fields": main.array(custom_field_type)
		},
		required: ["old_name"]
	}

	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
		return

	db_helper.check_if_category_exists(req.body.old_name, exists => {
		if (!exists)
			return res.status(400).send("A category with the old_name you specified does not exist!")
		db_helper.edit_category_in_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/equipment/delete", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"id": "string"
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
		return

	db_helper.delete_equipment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/category/delete", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string"
		},
		required: ["name"]
	}

	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
		return

	db_helper.check_if_category_exists(req.body.name, exists => {
		if (!exists)
			return res.status(400).send("The category you specified does not exist!")
		db_helper.delete_category_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.post("/type/delete", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"category": "string"
		},
		required: ["name", "category"]
	}

	if (!(await main.check_request(type, PERMS.EditInv, req.body, req.headers, res)))
		return

	db_helper.check_if_type_exists(req.body.category, req.body.name, code => {
		if (code != 0)
			return res.status(400).send("The type or category you specified does not exist!")
		db_helper.delete_type_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

main.app.get("/equipment/list", async (req, res) => {
	var type: main.bodyType = {
		fields: {}
	}

	if (!(await main.check_request(type, PERMS.ViewInv, req.body, req.headers, res)))
		return
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

main.app.get("/category/getimg/:name", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
		},
		required: ["name"]
	}

	if (!(await main.check_request(type, PERMS.None, req.params, req.headers, res)))
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

main.app.get("/equipment/getimg/:id", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"id": "string",
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.None, req.params, req.headers, res)))
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

main.app.post("/equipment/search", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"keywords": "string",
		},
		required: ["keywords"]
	}

	if (!(await main.check_request(type, PERMS.ViewInv, req.body, req.headers, res)))
		return

	db_helper.get_equipment_from_db(list => {
		var ret:any[] = []
		for (var item of list) {
			if (fits_search(item.name, req.body.keywords.split(" ")))
				ret.push(item)
		}
		res.send(JSON.stringify(ret))
	})
})

main.app.get("/categories/list", async (req, res) => {
	var type: main.bodyType = {
		fields: {}
	}

	if (!(await main.check_request(type, PERMS.ViewInv, req.params, req.headers, res)))
		return
	db_helper.get_categories_from_db(list => {
		res.send(JSON.stringify(list))
	})
})

main.app.get("/equipment/byid/:id", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"id": "string",
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.ViewInv, req.params, req.headers, res)))
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

main.app.get("/equipment/bytype/:category/:type", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"category": "string",
			"type": "string"
		},
		required: ["category", "type"]
	}

	if (!(await main.check_request(type, PERMS.ViewInv, req.params, req.headers, res)))
		return

	db_helper.get_equipment_by_type_from_db(req.params.category, req.params.type, equ => {
		res.send(JSON.stringify(equ))
	})
})