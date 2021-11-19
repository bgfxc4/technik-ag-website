import express from "express"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"

import * as db_helper from "./db_helper"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

const app = express()

app.use(body_parser.json({limit: "50mb"}))
app.use(cors())

export interface Equipment {
	id: string;
	name: string;
	description: string;
	storage_place:string;
	category: string;
	type: string;
	image: string;
	custom_fields: any;
}

export interface Category {
	name: string;
	types: string[];
	custom_fields: string[];
}

app.post("/authorize", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	return res.send("Ok")
})

app.post("/new-equipment", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	if (!req.body.description)
		return res.status(400).send("You have to set a description!")
	if (!req.body.storage_place)
		return res.status(400).send("You have to set a storage place!")
	if (!req.body.category)
		return res.status(400).send("You have to set a category!")
	if (!req.body.type)
		return res.status(400).send("You have to set a type!")
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

app.post("/new-category", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	db_helper.add_category_to_db(req.body, exists => {
		if (!exists)
			res.status(200).send("ok")
		else
			res.status(400).send("A category with this name exists already!")
	})
})

app.post("/new-type", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	if (!req.body.category)
		return res.status(400).send("You have to set a category!")
	db_helper.add_type_to_db(req.body, code => {
		if (code == 0)
			res.status(200).send("ok")
		else if (code == 1)
			res.status(400).send("The category you specified does not exist!")
		else
			res.status(400).send("A type with this name exists already in this category!")
	})
})

app.post("/edit-equipment", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	if (!req.body.id)
		return res.status(400).send("You have to specify an id of the item to edit!")
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	if (!req.body.description)
		return res.status(400).send("You have to set a description!")
	if (!req.body.storage_place)
		return res.status(400).send("You have to set a storage place!")
	if (!req.body.category)
		return res.status(400).send("You have to set a category!")
	if (!req.body.type)
		return res.status(400).send("You have to set a type!")
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

app.post("/delete-equipment", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")
	if (!req.body.id)
		return res.status(400).send("You have to set an id!")
	db_helper.delete_equipment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

app.post("/delete-category", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	db_helper.check_if_category_exists(req.body.name, exists => {
		if (!exists)
			return res.status(400).send("The category you specified does not exist!")
		db_helper.delete_category_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

app.post("/delete-type", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	if (!req.body.category)
		return res.status(400).send("You have to set a category!")
	db_helper.check_if_type_exists(req.body.category, req.body.name, code => {
		if (code != 0)
			return res.status(400).send("The type or category you specified do not exist!")
		db_helper.delete_type_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

app.get("/get-equipment", (req, res) => {
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

app.get("/get-categories", (req, res) => {
	db_helper.get_categories_from_db(list => {
		res.send(JSON.stringify(list))
	})
})

app.get("/get-equipment-by-id/:id", (req, res) => {
	if (!req.params.id)
		return res.status(401).send("The id you have given is not valid!")
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

app.get("/get-equipment-by-type/:category/:type", (req, res) => {
	if (!req.params.category)
		return res.status(401).send("You have to specify a category!")
	if (!req.params.type)
		return res.status(401).send("You have to specify a type!")
	db_helper.get_equipment_by_type_from_db(req.params.category, req.params.type, equ => {
		res.send(JSON.stringify(equ))
	})
})

function authorized(req_body:any) {
	if (req_body.login_hash === undefined) return false 
	for (var user of config.users) {
		if (sha512(req_body.login_hash) == user) {
			return true
		}
	}
	return false
}

db_helper.setup_mongodb()
app.listen(config.main_server_port, () => {
	console.log(`[express] The server is listening on port ${config.main_server_port}`)
})
