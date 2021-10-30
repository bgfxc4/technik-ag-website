import express from "express"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"
import {Db, MongoClient} from "mongodb"
import * as uuid from "uuid"

const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))
const item_image_placeholder = fs.readFileSync("./imgs/item-placeholder-img.png").toString('base64')

const app = express()
var db:Db;

app.use(body_parser.json({limit: "50mb"}))
app.use(cors())

interface Equipment {
	id: string;
	name: string;
	description: string;
	storage_place:string;
	category: string;
	type: string;
	image: string;
}

interface Category {
	name: string;
	types: string[];
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
	check_if_type_exists(req.body.category, req.body.type, code => {
		if (code == 1)
			return res.status(400).send("The category you specified does not exist!")
		if (code == 2)
			return res.status(400).send("The type you specified does not exist in the category you specified!")
		add_equipment_to_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

app.post("/new-category", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	add_category_to_db(req.body, exists => {
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
	add_type_to_db(req.body, code => {
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
	check_if_type_exists(req.body.category, req.body.type, code => {
		if (code == 1)
			return res.status(400).send("The category you specified does not exist!")
		if (code == 2)
			return res.status(400).send("The type you specified does not exist in the category you specified!")
		edit_equipment_in_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

app.post("/delete-equipment", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	if (!req.body.id)
		return res.status(400).send("You have to set an id!")
	delete_equipment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

app.post("/delete-category", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	if (!req.body.name)
		return res.status(400).send("You have to set a name!")
	check_if_category_exists(req.body.name, exists => {
		if (!exists)
			return res.status(400).send("The category you specified does not exist!")
		delete_category_from_db(req.body, () => {
			res.status(200).send("ok")
		})
	})
})

app.get("/get-equipment", (req, res) => {
   get_equipment_from_db(list => {
		get_categories_from_db(cats => {
			var result: any[] = []

			for (var cat of cats) {
				var types = []
				
				for (var t of cat.types)
					types.push({name: t, equipment: []})

				result.push({name: cat.name, types: types})
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
   get_categories_from_db(list => {
		res.send(JSON.stringify(list))
   })
})

app.get("/get-equipment-by-id/:id", (req, res) => {
	if (!req.params.id)
		return res.status(401).send("The id you have given is not valid!")
	get_equipment_by_id_from_db(req.params.id, list => {
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

function add_equipment_to_db(body: any, callback: () => void) {
	var equ: Equipment = {
		id: uuid.v4(),
		name: body.name,
		description: body.description,
		storage_place: body.storage_place,
		category: body.category,
		type: body.type,
		image: (body.image) ? body.image : item_image_placeholder
	}
	db.collection("equipment").insertOne(equ, err => {
		if (err)
			throw err
		callback()
	})
}

function add_category_to_db(body: any, callback: (exists: boolean) => void) {
	var cat: Category = {
		name: body.name,
		types: []
	}
	var query = { name: cat.name}
	db.collection("categories").find(query).toArray((err, data) => {
		if (err)
			throw err

		if (data == undefined || data.length != 0)
			return callback(true)
		
		db.collection("categories").insertOne(cat, err => {
			if (err)
				throw err
			callback(false)
		})
	})
}

function add_type_to_db(body: any, callback: (code: number) => void) {

	var query = { name: body.category}
	db.collection("categories").find(query).toArray((err, data) => {
		if (err)
			throw err

		if (data == undefined || data.length == 0)
			return callback(1)
		
		for (var t of data[0].types) {
			if (t == body.name) {
				callback(2)
				return
			}
		}
		data[0].types.push(body.name)
		db.collection("categories").updateOne({name: body.category}, {$set: {types: data[0].types}}, err => {
			if (err)
				throw err
			callback(0)
		})
	})
}

function edit_equipment_in_db(body: any, callback: () => void) {
	var query = { id: body.id}
	var update = {
		$set: {
			name: body.name, 
			description: body.description,
			storage_place: body.storage_place,
			category: body.category,
			type: body.type,
			image: (body.image) ? body.image : item_image_placeholder
		}
	}
	db.collection("equipment").updateOne(query, update, err => {
		if (err)
			throw err
		callback()
	})
}

function delete_equipment_from_db(body: any, callback: () => void) {
	var query = {id: body.id}
	db.collection("equipment").deleteOne(query, err => {
		if (err)
			throw err
		callback()
	})
}

function delete_category_from_db(body: any, callback: () => void) {
	db.collection("categories").deleteOne({name: body.name}, err => {
		if (err)
			throw err
		db.collection("equipment").deleteMany({category: body.name}, err2 => {
			if (err2)
				throw err2
			callback()
		})
	})
}

function get_equipment_from_db(callback: (res: any) => void) {
	db.collection("equipment").find().toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

function get_categories_from_db(callback: (res: any) => void) {
	db.collection("categories").find().toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

function get_equipment_by_id_from_db(id: string, callback: (res: any) => void) {
	db.collection("equipment").find().toArray((err, data) => {
		if (err) 
			throw err
		if (!data) {
			callback([])
			return
		}
		var ret = []
		for (var d of data) {
			if (d.id.startsWith(id))
				ret.push(d)
		}
		callback(ret)
	})
}

function check_if_category_exists(name: string, callback: (exists: boolean) => void) {
	db.collection("categories").find({name: name}).toArray((err, data) => {
		if (err)
			throw err
		if (data == undefined)
			return callback(false)
		if (data.length == 0)
			return callback(false)
		callback(true)
	})
}

function check_if_type_exists(category: string, name: string, callback: (code: number) => void) {
	db.collection("categories").find({name: category}).toArray((err, data) => {
		if (err)
			throw err
		if (data == undefined)
			return callback(1)
		if (data.length == 0)
			return callback(1)
		for (var t of data[0].types) {
			if (t == name) {
				callback(0)
				return
			}
		}
		callback(2)
	})
}

function authorized(req_body:any) {
	if (req_body.login_hash === undefined) return false 
	for (var user of config.users) {
		if (sha512(req_body.login_hash) == user) {
			return true
		}
	}
	return false
}

setup_mongodb()
app.listen(config.main_server_port, () => {
	console.log(`[express] The server is listening on port ${config.main_server_port}`)
})

function setup_mongodb() {
	MongoClient.connect(config.mongo_url).then(client => {
		db = client.db("technikag")
		console.log("[Database] connected to database!")
	})
}
