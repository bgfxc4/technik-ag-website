import * as fs from "fs"
import * as uuid from "uuid"
import * as main from "../main"
import { Equipment, Category } from "./routes"

const item_image_placeholder = fs.readFileSync("./imgs/item-placeholder-img.png").toString('base64')

export type CategoryCustomFields = {
	name: string,
	type: string,
	options?: string[]
}[]

export type ItemCustomFields = Record<string, string | boolean>

async function isUnusedItemID (id: string): Promise<boolean> {
	if (id[0] != 'I')
		return false
	if (!uuid.validate(id.substring(1)))
		return false

	return main.db_pool.query("SELECT id from item_list WHERE id = $1", [id]).then(res => {
		return res.rowCount == 0
	}).catch(err => {
		throw err
	})
} 

export async function add_equipment_to_db(id: string|undefined, name: string, description: string, amount: number, 
		room: string, shelf: string, compartment: string, category: string, type: string, body_custom_fields: ItemCustomFields, image?: string): Promise<void> {
	var custom_fields: {
		[key: string]: string | boolean;
	} = {}
	for (var f in body_custom_fields) {
		custom_fields[f] = body_custom_fields[f]
	}
	let item_id = "I"+uuid.v4()
	if (id && (await isUnusedItemID(id))) { // check if body.id is valid item id that is not yet used, if so, use it as ID
		item_id = id
	}
	let room_id = await main.db_pool.query("SELECT id FROM room_list WHERE name = $1", [room]).then(res => res.rows[0].id)
	let shelf_id = await main.db_pool.query("SELECT id FROM shelf_list WHERE name = $1 AND room_id = $2", [shelf, room_id]).then(res => res.rows[0].id)
	let comp_id = await main.db_pool.query("SELECT id FROM compartment_list WHERE name = $1 AND shelf_id = $2", [compartment, shelf_id]).then(res => res.rows[0].id)

	let cat_id = await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [category]).then(res => res.rows[0].id)
	let type_id = await main.db_pool.query("SELECT id FROM type_list WHERE name = $1 AND category_id = $2", [type, cat_id]).then(res => res.rows[0].id)

	return main.db_pool.query("INSERT INTO item_list (id, type_id, compartment_id, name, description, amount, image, custom_fields) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		[item_id, type_id, comp_id, name, description, amount, (image) ? image : item_image_placeholder, custom_fields]
	).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function add_category_to_db(name: string, custom_fields: CategoryCustomFields, image?: string): Promise<boolean> {
	if (await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [name]).then(res => res.rowCount) != 0)
		return true
	let cat_id = "C"+uuid.v4()
	await main.db_pool.query("INSERT INTO category_list (id, name, image) VALUES ($1, $2, $3)", [cat_id, name, (image) ? image : item_image_placeholder]).catch(err => {
		throw err
	})

	let all_promises: Promise<any>[] = []
	for (var c of custom_fields) {
		console.log(c)
		all_promises.push(main.db_pool.query("INSERT INTO custom_field_list (category_id, name, type, options) VALUES ($1, $2, $3, $4)", 
			[cat_id, c.name, c.type, c.options]
		))
	}
	return Promise.all(all_promises).then(_ => {
		return false
	}).catch(err => {
		throw err
	})
}

export async function add_type_to_db(name: string, category: string): Promise<number> {
	let cats = await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [category]).catch(err => { throw err })
	if (cats.rowCount == 0)
		return 1
	let types = await main.db_pool.query("SELECT id FROM type_list WHERE name = $1 AND category_id = $2", [name, cats.rows[0].id]).catch(err => { throw err })
	if (types.rowCount != 0)
		return 2
	
	let type_id = "T"+uuid.v4()
	return main.db_pool.query("INSERT INTO type_list (id, category_id, name) VALUES ($1, $2, $3)", [type_id, cats.rows[0].id, name]).then(_ => {
		return 0
	}).catch(err => {
		console.log(err, cats.rows[0].id)
		throw err
	})
}

export async function edit_equipment_in_db(id: string, name: string, description: string, amount: number, custom_fields: ItemCustomFields, 
		room: string, shelf: string, compartment: string, category: string, type: string, image?: string): Promise<void> {
	let room_id = await main.db_pool.query("SELECT id FROM room_list WHERE name = $1", [room]).then(res => res.rows[0].id)
	let shelf_id = await main.db_pool.query("SELECT id FROM shelf_list WHERE name = $1 AND room_id = $2", [shelf, room_id]).then(res => res.rows[0].id)
	let comp_id = await main.db_pool.query("SELECT id FROM compartment_list WHERE name = $1 AND shelf_id = $2", [compartment, shelf_id]).then(res => res.rows[0].id)

	let cat_id = await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [category]).then(res => res.rows[0].id)
	let type_id = await main.db_pool.query("SELECT id FROM type_list WHERE name = $1 AND category_id = $2", [type, cat_id]).then(res => res.rows[0].id)

	return main.db_pool.query("UPDATE item_list SET type_id = $2, compartment_id = $3, name = $4, description = $5, amount = $6, image = $7, custom_fields = $8 WHERE id = $1",
		[id, type_id, comp_id, name, description, amount, (image) ? image : item_image_placeholder, custom_fields]
	).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_category_in_db(old_name: string, new_name: string|undefined, custom_fields: CategoryCustomFields|undefined, image?: string): Promise<void> {
	let query = "UPDATE category_list SET"
	let idx = 1
	let params = []
	if (new_name) {
		query += ` name = $${idx++},`
		params.push(new_name)
	}
	if (image) {
		query += ` image = $${idx++},`
		params.push(image)
	}

	if (custom_fields) {
		let cat_id = await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [old_name]).then(res => res.rows[0].id)
		await main.db_pool.query("DELETE FROM custom_field_list WHERE category_id = $1", [cat_id]).catch(err => {throw err})

		let all_promises: Promise<any>[] = []
		for (var c of custom_fields) {
			all_promises.push(main.db_pool.query("INSERT INTO custom_field_list (category_id, name, type, options) VALUES ($1, $2, $3, $4)", 
				[cat_id, c.name, c.type, c.options]
			))
		}
		await Promise.all(all_promises).then(_ => {
			return true
		}).catch(err => {
			throw err
		})
	}
	query = query.slice(0, -1) // remove trailing , at the end
	query += ` WHERE name = $${idx++}`
	params.push(old_name)
	return main.db_pool.query(query, params).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_type_in_db(old_name: string, category: string, new_name: string): Promise<void> {
	let cat_id = await main.db_pool.query("SELECT id FROM category_list where name = $1", [category]).then(res => res.rows[0].id)
	return main.db_pool.query("UPDATE category_list SET name = $1 WHERE name = $2 AND category_id = $3", [new_name, old_name, cat_id]).then(_ => {
		return
	}).catch(err => {throw err})
}

export async function delete_equipment_from_db(id: string): Promise<void> {
	return main.db_pool.query("DELETE FROM item_list WHERE id = $1", [id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function delete_category_from_db(name: string): Promise<void> {
	return main.db_pool.query("DELETE FROM category_list WHERE name = $1", [name]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function delete_type_from_db(name: string, category: string): Promise<void> {
	let cat_id = await main.db_pool.query("SELECT id FROM category_list where name = $1", [category]).then(res => res.rows[0].id)
	return main.db_pool.query("DELETE FROM type_list WHERE name = $1 AND category_id = $2", [name, cat_id]).then(_ => {
		return
	}).catch(err => {throw err})
}

export async function get_equipment_from_db(withImage=false): Promise<Equipment[]> {
	const query = `SELECT item_list.id "id", room_list.name "room", shelf_list.name "shelf", compartment_list.name "compartment",
					item_list.name "name", description, amount, ${withImage ? 'item_list.image "image", ' : ""}custom_fields,
					category_list.name "category", type_list.name "type"
				FROM item_list
				LEFT JOIN type_list
				ON type_list.id = item_list.type_id
				LEFT JOIN category_list
				ON category_list.id = type_list.category_id
				LEFT JOIN compartment_list
				ON compartment_list.id = item_list.compartment_id
				LEFT JOIN shelf_list
				ON shelf_list.id = compartment_list.shelf_id
				LEFT JOIN room_list
				ON room_list.id = shelf_list.room_id`
	return main.db_pool.query(query).then(res => res.rows)
}

export async function get_categories_from_db(withImage=false): Promise<Category[]> {
	const query = `
		SELECT row_to_json(t) 
			FROM (
				SELECT id, name,${withImage ? "image, " : " "}
					(
						SELECT json_agg(s.name)
						FROM (
							SELECT name
							FROM type_list
							WHERE type_list.category_id = category_list.id
						) s
					) as types,
					(
						SELECT array_to_json(array_agg(row_to_json(f)))
						FROM (
							SELECT name, type, options FROM custom_field_list
							WHERE custom_field_list.category_id = category_list.id
						) f
					) as custom_fields
				FROM category_list
			) t
	`
	return main.db_pool.query(query).then(res => res.rows.map(el => el.row_to_json)).catch(err => {
		throw err
	})
}

export async function get_equipment_by_id_from_db(id: string, withImage=false): Promise<Equipment[]> {
	const query = `SELECT item_list.id "id", room_list.name "room", shelf_list.name "shelf", compartment_list.name "compartment",
					item_list.name "name", description, amount, ${withImage ? 'item_list.image "image", ' : ""}custom_fields,
					category_list.name "category", type_list.name "type"
				FROM item_list
				LEFT JOIN type_list
				ON type_list.id = item_list.type_id
				LEFT JOIN category_list
				ON category_list.id = type_list.category_id
				LEFT JOIN compartment_list
				ON compartment_list.id = item_list.compartment_id
				LEFT JOIN shelf_list
				ON shelf_list.id = compartment_list.shelf_id
				LEFT JOIN room_list
				ON room_list.id = shelf_list.room_id
				WHERE item_list.id LIKE $1`
	return main.db_pool.query(query, [`${id}%`]).then(res => res.rows)
}

export async function get_category_by_name(name: string): Promise<Category> {
	const query = `
	SELECT row_to_json(t) 
		FROM (
			SELECT id, name, image,
				(
					SELECT json_agg(s.name)
					FROM (
						SELECT name
						FROM type_list
						WHERE type_list.category_id = category_list.id
					) s
				) as types,
                (
                    SELECT array_to_json(array_agg(row_to_json(f)))
                    FROM (
                        SELECT name, type, options FROM custom_field_list
                        WHERE custom_field_list.category_id = category_list.id
                    ) f
                ) as custom_fields
			FROM category_list
			WHERE category_list.name = $1
		) t
`
	return main.db_pool.query(query, [name]).then(res => res.rows[0].row_to_json).catch(err => {
		throw err
	})
}

export async function get_equipment_by_type_from_db(category: string, type: string, withImage=false): Promise<Equipment[]> {
	const query = `SELECT item_list.id "id", room_list.name "room", shelf_list.name "shelf", compartment_list.name "compartment",
					item_list.name "name", description, amount${withImage ? ', item_list.image "image"' : ''}, custom_fields,
					category_list.name "category", type_list.name "type"
				FROM item_list
				LEFT JOIN type_list
				ON type_list.id = item_list.type_id
				LEFT JOIN category_list
				ON category_list.id = type_list.category_id
				LEFT JOIN compartment_list
				ON compartment_list.id = item_list.compartment_id
				LEFT JOIN shelf_list
				ON shelf_list.id = compartment_list.shelf_id
				LEFT JOIN room_list
				ON room_list.id = shelf_list.room_id
				WHERE item_list.type_id = $1`

	let cat_id = await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [category]).then(res => res.rows[0]?.id)
	let type_id = await main.db_pool.query("SELECT id FROM type_list WHERE name = $1 AND category_id = $2", [type, cat_id]).then(res => res.rows[0]?.id)
	return main.db_pool.query(query, [type_id]).then(res => res.rows)
}

export async function check_if_category_exists(name: string): Promise<boolean> {
	return main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [name]).then(res => res.rowCount != 0).catch(err => {
		throw err
	})
}

export async function check_if_type_exists(category: string, name: string): Promise<number> {
	let cat_id = await main.db_pool.query("SELECT id FROM category_list WHERE name = $1", [category]).then(res => res.rows[0]?.id)
	if (!cat_id) return 1
	return main.db_pool.query("SELECT id FROM type_list WHERE name = $1 AND category_id = $2", [name, cat_id]).then(_ => {
		return 0
	}).catch(err => {
		throw err
	})
}

export async function get_appointments_of_item(id: string): Promise<object[]> {
	const query = `SELECT name, appointment_list.id as "id", amount, date, end_date FROM appointment_item_bookings
				LEFT JOIN appointment_list ON appointment_list.id = appointment_item_bookings.appointment_id
				WHERE item_id = $1`
	return main.db_pool.query(query, [id]).then(res => {
		return res.rows.map(el => {el.date = Number(el.date); el.end_date = Number(el.end_date); return el})
	}).catch(err => { throw err })
}
