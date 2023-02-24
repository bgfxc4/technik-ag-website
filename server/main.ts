import express from "express"
import cors from "cors"
import * as fs from "fs"
import {sha512} from "js-sha512"
import {PERMS} from "./permissions"
import * as user_db from "./users/db_helper"
import {Pool, types} from "pg"
import { AnyZodObject } from "zod"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

export const app = express()

types.setTypeParser(20, BigInt)
export const db_pool = new Pool({ connectionString: config.postgres_connection_string})

app.use(express.json({limit: "50mb"}))
app.use(cors())

console.log("start")

export async function authorized(req_headers:any) {
	let groups = await user_db.get_groups_from_db()

	if (req_headers.authorization == undefined) return undefined
	return await user_db.get_users_from_db(true).then(users => {
		for (var user of users) {
			if (sha512(req_headers.authorization) == user.login_hash) {
				return {
					permissions: user.permissions | (groups.find(el => el.id == user.group_id)?.permissions || 0),
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

export async function check_request<T>(type: AnyZodObject, needs_auth: number, body: unknown, headers: any, res: any): Promise<T | undefined> {
	if (needs_auth != PERMS.None) {
		var user = await authorized(headers)
		if (user == undefined) {
			res.status(401).send("Login credentials are wrong or non-existent!")
			return undefined
		}
		if ((user.permissions & needs_auth) != needs_auth && user.permissions != PERMS.Admin) {
			res.status(401).send("You do not have the required permissions!")
			return undefined
		}
	}
	try {
		var ret = await type.parseAsync(body)
	} catch (e) {
		res.status(500).send(JSON.stringify(e))
		return undefined
	}

	return ret as T
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
import "./tools/routes"
