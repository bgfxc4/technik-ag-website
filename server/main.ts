import express from "express"
import {Db, MongoClient} from "mongodb"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"
import {PERMS} from "./permissions"
import * as user_db from "./users/db_helper"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

export var db:Db;
export const app = express()

app.use(body_parser.json({limit: "50mb"}))
app.use(cors())

export async function authorized(req_headers:any) {
	return new Promise((resolve, _reject) => {
		if (req_headers.authorization == undefined) resolve(undefined)
		user_db.get_users_from_db(users => {
			for (var user of users) {
				if (sha512(req_headers.authorization) == user.login_hash) {
					resolve({
						permissions: user.permissions,
						display_name: user.display_name
					})
				}
			}
			resolve(undefined)
		}, true)
	})
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

export async function check_request(needed_fields: string[], needs_auth: number, body: any, headers: any, res: any) {
	if (needs_auth != PERMS.None) {
		var user:any = await authorized(headers)
		if (user == undefined) {
			res.status(401).send("Login credentials are wrong or non-existent!")	
			return false
		}
		if ((user.permissions & needs_auth) == 0 && user.permissions != PERMS.Admin) {
			res.status(401).send("You do not have the required permissions!")
			return false
		}
	}
	for (var f of needed_fields) {
		if (body[f] == undefined) {
			res.status(400).send(`You need to specify the field '${f}'`)
			return false
		}
	}
	return true
}

app.get("/authorize", async (req, res) => {
	var auth = await authorized(req.headers)
	if (auth == undefined)
		return res.status(401).send("Login credentials are wrong or non-existent!")	
	res.send(auth)
})

import "./inventory/routes"
import "./storage/routes"
import "./users/routes"