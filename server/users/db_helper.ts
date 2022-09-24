import * as main from "../main"
import {sha512} from "js-sha512"
import * as storage from "./routes"
import * as uuid from "uuid"

export async function get_users_from_db(with_login_hash=false): Promise<any> {
	const query = `SELECT display_name, permissions, id${with_login_hash ? ", login_hash" : ""} FROM user_list`
	return main.db_pool.query(query).then(data => {
		for (var u of main.config.users) {
			var user = {
				display_name: u.display_name,
				permissions: u.permissions,
				id: u.id,
				login_hash: null
			}
			if (with_login_hash)
				user.login_hash = u.login_hash
			data.rows.push(u)
		}
		return data.rows
	})
}

export function add_user_to_db(user: any): Promise<void> {
	return main.db_pool.query("INSERT INTO user_list (id, display_name, login_hash, permissions) VALUES ($1, $2, $3, $4)", ["U"+uuid.v4(), user.display_name, sha512(user.login_hash), 0]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export function user_exists_in_db(login_hash: string, display_name: string, id: string) {
	return main.db_pool.query("SELECT id FROM user_list WHERE login_hash = $1 OR display_name = $2 OR id = $3", [login_hash, display_name, id]).then(res => {
		return res.rowCount != 0
	}).catch(err => {
		throw err
	})
}

export function remove_user_from_db(user: any): Promise<void> {
	return main.db_pool.query("DELETE FROM user_list WHERE id = $1", [user.id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export function set_user_perm(body: any): Promise<void> {
	return main.db_pool.query("UPDATE user_list SET permissions = $1 WHERE id = $2", [body.permissions, body.id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export function edit_user(body: any): Promise<void> {
	let query = "UPDATE user_list SET"
	if (body.login_hash) {
		query += " login_hash = $1,"
	}
	if (body.display_name) {
		query += " display_name = $2,"
	}
	query = query.slice(0, -1) // remove trailing , at the end
	query += " WHERE id = $3"
	return main.db_pool.query(query, [sha512(body.login_hash), body.display_name, body.id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}