import * as main from "../main"
import {sha512} from "js-sha512"
import * as storage from "./routes"

export function get_users_from_db(callback: (res: any) => void, with_login_hash=false) {
    var projection = with_login_hash ? {} : {login_hash: 0}
	main.db.collection("users").find().project(projection).toArray((err, data) => {
		if (err)
			throw err
		for (var u of main.config.users) {
			var user = {
				display_name: u.display_name,
				permissions: u.permissions,
				login_hash: null
			}
			if (with_login_hash)
				user.login_hash = u.login_hash
			data?.push(u)
		}
		callback(data)
	})
}

export async function add_user_to_db(user: any, callback: () => void) {
	var u: storage.User = {
		display_name: user.display_name,
		login_hash: sha512(user.login_hash),
		permissions: 0
	}
	await main.db.collection("users").insertOne(u)
	callback()
}

export async function user_exists_in_db(login_hash: string, display_name: string) {
	var query = {
		$or: [
			{"login_hash": login_hash},
			{"display_name": display_name}
		]
	}
	var res = await main.db.collection("users").find(query).toArray()
	return res.length != 0
}

export async function remove_user_from_db(user: any, callback: () => void) {
	await main.db.collection("users").deleteOne({display_name: user.display_name})
	callback()
}

export async function set_user_perm(body: any, callback: () => void) {
	var update = {
		$set: {
			permissions: body.permissions
		}
	}
	await main.db.collection("users").updateOne({display_name: body.display_name}, update)
	callback()
}