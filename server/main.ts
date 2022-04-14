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

export interface bodyType {
	fields: { [key:string]: string|bodyType}
	required?: string[]
} 

export async function check_request(type: bodyType, needs_auth: number, body: any, headers: any, res: any) {
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
	if (!check_request_type(body, type, res, "")) {
		return false
	}

	return true
}

function check_request_type(obj: any, type: bodyType, res: any, pre: string) {
	if (type.required) { // if there are required types, check them
		for (var key of type.required) {
			if (obj[key] === undefined) {
				res.status(422).send(`The field '${pre+key}' is required!`)
				return false
			}
		}
	}

	for (var key of Object.keys(obj)) {
		if (type.fields[key] === undefined) {
			res.status(422).send(`You are not supposed to specify the field ${pre+key}!`)
			return false
		}
		switch (type.fields[key]) {
			case "string":
				if (typeof obj[key] !== "string") {
					res.status(422).send(`The field ${pre+key} has to be of type 'string'!`)
					return false
				}
				break
			case "number":
				if ( isNaN(obj[key])) {
					res.status(422).send(`The field ${pre+key} has to be of type 'number'!`)
					return false
				}
				break
			case "object":
				if (typeof obj[key] !== "object") {
					res.status(422).send(`The field ${pre+key} has to be of type 'object'!`)
					return false
				}
				break
			default:
				if (typeof type.fields[key] === "object") { // if there is a nested object in the body required => recursion
					if (!check_request_type(obj[key], type.fields[key] as bodyType, res, pre+`${key}.`))
						return false
				}
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