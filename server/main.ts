import express from "express"
import cors from "cors"
import * as fs from "fs"
import body_parser from "body-parser"
import {sha512} from "js-sha512"

import * as db_helper from "./db_helper"

export const config = JSON.parse(fs.readFileSync("./configs/config.json", "utf-8"))

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

process.title = "node technikag-website"
db_helper.setup_mongodb()
app.listen(config.main_server_port, () => {
	console.log(`[express] The server is listening on port ${config.main_server_port}`)
})

import "./inventory-routes"
