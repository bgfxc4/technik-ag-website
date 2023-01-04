import express from "express"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"
import {PERMS} from "./permissions"
import * as user_db from "./users/db_helper"
import {Pool, types} from "pg"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

export const app = express()

types.setTypeParser(20, BigInt)
export const db_pool = new Pool({ connectionString: config.postgres_connection_string})

app.use(body_parser.json({limit: "50mb"}))
app.use(cors())

console.log("start")

export async function authorized(req_headers:any) {
	let groups = await user_db.get_groups_from_db()

	if (req_headers.authorization == undefined) return undefined
	return await user_db.get_users_from_db(true).then((users: any) => {
		for (var user of users) {
			if (sha512(req_headers.authorization) == user.login_hash) {
				return {
					permissions: user.permissions | groups.find((el:any) => el.id == user.group_id).permissions,
					display_name: user.display_name
				}
			}
		}
		return undefined
	})
}

process.title = "node technikag-website"
app.listen(config.main_server_port, () => {
	console.log(`[express] The server is listening on port ${config.main_server_port}`)
})

interface nestedBodyType {
	type: string,
	content: bodyType|string
}

export interface bodyType {
	fields: { [key:string]: string|nestedBodyType}
	required?: string[]
} 

export function array(type: bodyType|string) {
	var ret: nestedBodyType = {
		type: "array",
		content: type
	}
	return  ret
}

export function object(type: bodyType) {
	return {
		type: "object",
		content: type
	}
} 

export async function check_request(type: bodyType, needs_auth: number, body: any, headers: any, res: any) {
	if (needs_auth != PERMS.None) {
		var user = await authorized(headers)
		if (user == undefined) {
			res.status(401).send("Login credentials are wrong or non-existent!")
			return false
		}
		if ((user.permissions & needs_auth) != needs_auth && user.permissions != PERMS.Admin) {
			res.status(401).send("You do not have the required permissions!")
			return false
		}
	}
	if (!check_request_type(body, type, res, "")) {
		return false
	}

	return true
}

function check_request_type(obj: any, type: bodyType|string, res: any, pre: string) {
	if (typeof type == "string") {
		if (!check_typeof_helper(type as string, obj)) {
			res.status(422).send(`The request has to be of type '${type}'!`)
			return false
		}
		return true
	} else {
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

			if (typeof type.fields[key] === "object") { // if there is a nested object in the body required => recursion
				switch ((type.fields[key] as nestedBodyType).type) { // check of what type the nested type is
					case "object": // if it is a normal object, just do recursion
						if (!check_request_type(obj[key], (type.fields[key] as nestedBodyType).content as bodyType, res, pre+`${key}.`))
							return false
						break
					case "array": // if it is an array, iterate through it and check type of every item
						if (!Array.isArray(obj[key])){
							res.status(422).send(`The field '${pre+key}' has to be an array!`)
							return false
						}
						for (var i in obj[key])
							if (!check_request_type(obj[key][i], (type.fields[key] as nestedBodyType).content, res, pre+`${key}[${i}].`))
								return false
						break
				}
			} else if (typeof type.fields[key] === "string") { // if the type is just defined by a string, use the helper method to check the type
				if (!check_typeof_helper(type.fields[key] as string, obj[key])) {
					res.status(422).send(`The field ${pre+key} has to be of type '${type.fields[key]}'!`)
					return false
				}
			}
		}
		return true
	}
}

function check_typeof_helper(type: string, obj: any) {
	switch (type) {
		case "string":
			if (typeof obj !== "string") {
				return false
			}
			break
		case "number":
			if ( isNaN(obj)) {
				return false
			}
			break
		case "object":
			if (typeof obj !== "object") {
				return false
			}
			break
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
import "./appointments/routes"
import "./storage/routes"
import "./users/routes"