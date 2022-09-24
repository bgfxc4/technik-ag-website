import * as main from "../main"

export function get_storage_from_db(): Promise<any> {
	const query = `SELECT row_to_json(t)
	FROM (
		SELECT name, id,
			(
				SELECT array_to_json(array_agg(row_to_json(s)))
				FROM (
					SELECT name, id,
						(
							SELECT array_to_json(array_agg(row_to_json(c)))
							FROM (
								SELECT name, id, 
                                    (
                                        SELECT array_to_json(array_agg(row_to_json(i)))
                                        FROM (
                                            SELECT name, id
                                            FROM item_list
                                            WHERE item_list.compartment_id = compartment_list.id
                                        ) i
                                    ) as items
								FROM compartment_list
								WHERE shelf_list.id = compartment_list.shelf_id
							) c
						) as compartments
					FROM shelf_list
					WHERE room_list.id = shelf_list.room_id
				) s
			) as shelfs
		FROM room_list
	) t`
	return main.db_pool.query(query).then(res => {
		return res.rows.map(el => el.row_to_json)
	})
}

export function add_room_to_db(body: any): Promise<boolean> {
	return main.db_pool.query("INSERT INTO room_list (name) VALUES ($1)", [body.name]).then(_ => {
		return true
	}).catch(err => {
		console.log(err)
		throw err
	})
}

export function delete_room_from_db(body: any): Promise<void> {
	return main.db_pool.query("DELETE FROM room_list WHERE name = $1", [body.name]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_room_in_db(body: any): Promise<void> {
	return main.db_pool.query("UPDATE room_list SET name = $1 WHERE name = $2", [body.name, body.old_name]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function add_shelf_to_db(body: any): Promise<number> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [body.room]).catch(err =>  {throw err})
	if (room.rowCount == 0)
		return 1
	let shelfs = await main.db_pool.query("SELECT * FROM shelf_list WHERE room_id = $1 AND name = $2", [room.rows[0].id, body.name]).catch(err =>  {throw err})
	if (shelfs.rowCount != 0)
		return 2
	await main.db_pool.query("INSERT INTO shelf_list (room_id, name) VALUES ($1, $2)", [room.rows[0].id, body.name]).catch(err =>  {throw err})
	return 0
}

export async function delete_shelf_from_db(body: any): Promise<void> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [body.room]).catch(err =>  {throw err})
	return main.db_pool.query("DELETE FROM shelf_list WHERE room_id = $1 AND name = $2", [room.rows[0].id, body.name]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_shelf_in_db(body: any): Promise<void> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [body.room]).catch(err =>  {throw err})
	return main.db_pool.query("UPDATE shelf_list SET name = $1 WHERE name = $2 AND room_id = $3", [body.name, body.old_name, room.rows[0].id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function add_compartment_to_db(body: any): Promise<number> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [body.room]).catch(err =>  {throw err})
	if (room.rowCount == 0)
		return 1
	let shelf = await main.db_pool.query("SELECT * FROM shelf_list WHERE name = $1 AND room_id = $2", [body.shelf, room.rows[0].id]).catch(err =>  {throw err})
	if (shelf.rowCount == 0)
		return 2
	let comps = await main.db_pool.query("SELECT * FROM compartment_list WHERE shelf_id = $1 AND name = $2", [shelf.rows[0].id, body.name]).catch(err =>  {throw err})
	if (comps.rowCount != 0)
		return 3
	await main.db_pool.query("INSERT INTO compartment_list (shelf_id, name) VALUES ($1, $2)", [shelf.rows[0].id, body.name]).catch(err =>  {throw err})
	return 0
}

export async function delete_compartment_from_db(body: any): Promise<void> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [body.room]).catch(err =>  {throw err})
	let shelf = await main.db_pool.query("SELECT * FROM shelf_list WHERE name = $1 AND room_id = $2", [body.shelf, room.rows[0].id]).catch(err =>  {throw err})
	return main.db_pool.query("DELETE FROM compartment_list WHERE shelf_id = $1 AND name = $2", [shelf.rows[0].id, body.name]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_compartment_in_db(body: any): Promise<void> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [body.room]).catch(err =>  {throw err})
	let shelf = await main.db_pool.query("SELECT * FROM shelf_list WHERE name = $1 AND room_id = $2", [body.shelf, room.rows[0].id]).catch(err =>  {throw err})
	return main.db_pool.query("UPDATE compartment_list SET name = $1 WHERE shelf_id = $2 AND name = $3", [body.name, shelf.rows[0].id, body.old_name]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function compartment_exists(r: string, s: string, c: string): Promise<boolean> {
	let room = await main.db_pool.query("SELECT * FROM room_list WHERE name = $1", [r]).catch(err =>  {throw err})
	let shelf = await main.db_pool.query("SELECT * FROM shelf_list WHERE name = $1 AND room_id = $2", [s, room.rows[0].id]).catch(err =>  {throw err})
	return (await main.db_pool.query("SELECT * FROM compartment_list WHERE shelf_id = $1 AND name = $2", [shelf.rows[0].id, c]).catch(err => { throw err })).rowCount != 0
}