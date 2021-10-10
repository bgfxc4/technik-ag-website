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

app.use(body_parser.json())
app.use(cors())

interface Equipment {
	id: string;
	name: string;
	description: string;
	storage_place:string;
	category: string;
	image: string;
}


var equipment_list: Equipment[] = [
	{
		id: "0",
		name: "testItem",
		description: "just a test item",
		storage_place: "room1",
		category: "testCategory1",
		image: item_image_placeholder
	},
	{
		id: "0",
		name: "testItem",
		description: "just a test test item",
		storage_place: "room1",
		category: "testCategory1",
		image: item_image_placeholder
	},
	{
		id: "1",
		name: "testItem2",
		description: "just the second test item",
		storage_place: "room2",
		category: "testCategory2",
		image: item_image_placeholder
	}
]

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
	add_equipment_to_db(req.body, () => {
		res.status(200).send("ok")
	})
})

app.get("/get-equipment", (req, res) => {
	get_equipment_from_db(list => {
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
		image: item_image_placeholder
	}
	db.collection("equipment").insertOne(equ, err => {
		if (err)
			throw err
		callback()
	})
}

function get_equipment_from_db(callback: (res: any) => void) {
	db.collection("equipment").find().toArray((err, data) => {
		if (err) 
			throw err
		callback(data)
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
