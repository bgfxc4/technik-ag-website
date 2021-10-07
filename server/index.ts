import express from "express"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"
import {Db, MongoClient} from "mongodb"

const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

const app = express()
var db:Db;

app.use(body_parser.json())
app.use(cors())

interface Equipment {
	id: number;
	name: string;
}

interface EquipmentCategory {
	name: string;
	equipment: Equipment[];
}

var equipment_list: EquipmentCategory[] = []

app.post("/authorize", (req, res) => {
	if (!authorized(req.body))
		return res.status(401).send("Login credentials are wrong or not existent!")	
	return res.send("Ok")
})

app.get("/get-equipment", (req, res) => {
	res.send(JSON.stringify(equipment_list))
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
