import express from "express"
import {Db, MongoClient} from "mongodb"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

export var db:Db;
export const app = express()

app.use(body_parser.json({limit: "50mb"}))
app.use(cors())

export function authorized(req_body:any) {
	if (req_body.login_hash === undefined) return false 
	for (var user of config.users) {
		if (sha512(req_body.login_hash) == user) {
			return true
		}
	}
	return false
}

function setup_mongodb() {
	MongoClient.connect(config.mongo_url).then(client => {
		db = client.db("technikag")
		console.log("[Database] connected to database!")
	})
}

process.title = "node technikag-website"
setup_mongodb()
app.listen(config.main_server_port, () => {
	console.log(`[express] The server is listening on port ${config.main_server_port}`)
})

export function check_request(needed_fields: string[], needs_auth: boolean, body: any, res: any) {
	if (needs_auth && !authorized(body)) {
		res.status(401).send("Login credentials are wrong or not existent!")	
		return false
	}
	for (var f of needed_fields) {
		if (!body[f]) {
			res.status(400).send(`You need to specify the field '${f}'`)
			return false
		}
	}
	return true
}

import "./inventory/routes"
import "./storage/routes"
