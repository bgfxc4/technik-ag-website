import * as main from "../main"
import {sha512} from "js-sha512"
import * as uuid from "uuid"
import { Group } from "./routes"

export async function get_users_from_db(with_login_hash=false): Promise<any> {
	const query = `SELECT group_id, display_name, permissions, id${with_login_hash ? ", login_hash" : ""} FROM user_list`
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
	return main.db_pool.query("INSERT INTO user_list (id, display_name, login_hash, permissions, group_id) VALUES ($1, $2, $3, $4, $5)", ["U"+uuid.v4(), user.display_name, sha512(user.login_hash), 0, user.group_id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export function add_group_to_db(group: any): Promise<void> {
	return main.db_pool.query("INSERT INTO group_list (id, name, permissions) VALUES ($1, $2, $3)", ["G"+uuid.v4(), group.name, 0]).then(_ => {
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

export function remove_group_from_db(group: any): Promise<void> {
	return main.db_pool.query("DELETE FROM group_list WHERE id = $1", [group.id]).then(_ => {
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

export async function get_groups_from_db(): Promise<any> {
	const query = `SELECT name, permissions, id FROM group_list`
	return main.db_pool.query(query).then(el => {
		let admin_group: Group = {
			name: "Admins",
			permissions: 1,
			id: "G00000000-0000-0000-0000-000000000000"
		}
		el.rows.push(admin_group)
		return el.rows
	})
}

export function group_exists_in_db(id: string) {
	return main.db_pool.query("SELECT id FROM group_list WHERE id = $1", [id]).then(res => {
		return res.rowCount != 0
	}).catch(err => {
		throw err
	})
}

export function edit_user(body: any): Promise<void> {
	let query = "UPDATE user_list SET"
	let args = []
	if (body.login_hash) {
		args.push(sha512(body.login_hash))
		query += ` login_hash = $${args.length},`
	}
	if (body.display_name) {
		args.push(body.display_name)
		query += ` display_name = $${args.length},`
	}
	if (body.group_id) {
		args.push(body.group_id)
		query += ` group_id = $${args.length},`
	}
	query = query.slice(0, -1) // remove trailing , at the end
	args.push(body.id)
	query += ` WHERE id = $${args.length}`

	return main.db_pool.query(query, args).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export function edit_group(body: any): Promise<void> {
	let query = "UPDATE group_list SET "
	let args = []
	if (body.name) {
		args.push(body.name)
		query += ` name = $${args.length},`
	}
	if (body.permissions) {
		args.push(body.permissions)
		query += ` permissions = $${args.length},`
	}
	query = query.slice(0, -1) // remove trailing , at the end
	args.push(body.id)
	query += ` WHERE id = $${args.length}`
	return main.db_pool.query(query, args).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function get_perms_of_user_and_group(id: String): Promise<number> {
	let user = await main.db_pool.query("SELECT permissions, group_id FROM user_list WHERE id = $1", [id]).then(el => el.rows[0])
	let group = await main.db_pool.query("SELECT permissions FROM group_list WHERE id = $1", [user.group_id]).then(el => el.rows[0])
	return user.permissions | group.permissions
}