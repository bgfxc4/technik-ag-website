import * as main from "../main"
import { Room } from "./routes"
import * as t from "../types/storage"

export async function get_storage_from_db(): Promise<Room[]> {
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

export async function add_room_to_db(name: string): Promise<boolean> {
	return main.db_pool.query("INSERT INTO room_list (name) VALUES ($1)", [name]).then(_ => {
		return true
	}).catch(err => {
		console.log(err)
		throw err
	})
}

export async function delete_room_from_db(id: t.ExistingRoomID): Promise<void> {
	return main.db_pool.query("DELETE FROM room_list WHERE id = $1", [id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_room_in_db(id: t.ExistingRoomID, new_name: string): Promise<void> {
	return main.db_pool.query("UPDATE room_list SET name = $1 WHERE id = $2", [new_name, id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function add_shelf_to_db(room_id: t.ExistingRoomID, name: string): Promise<number> {
	await main.db_pool.query("INSERT INTO shelf_list (room_id, name) VALUES ($1, $2)", [room_id, name]).catch(err =>  {throw err})
	return 0
}

export async function delete_shelf_from_db(id: t.ExistingShelfID): Promise<void> {
	return main.db_pool.query("DELETE FROM shelf_list WHERE id = $1", [id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_shelf_in_db(id: t.ExistingShelfID, new_name: string): Promise<void> {
	return main.db_pool.query("UPDATE shelf_list SET name = $1 WHERE id = $2", [new_name, id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function add_compartment_to_db(shelf_id: t.ExistingShelfID, name: string): Promise<number> {
	await main.db_pool.query("INSERT INTO compartment_list (shelf_id, name) VALUES ($1, $2)", [shelf_id, name]).catch(err =>  {throw err})
	return 0
}

export async function delete_compartment_from_db(id: t.ExistingCompartmentID): Promise<void> {
	return main.db_pool.query("DELETE FROM compartment_list WHERE id = $1", [id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}

export async function edit_compartment_in_db(id: t.ExistingCompartmentID, new_name: string): Promise<void> {
	return main.db_pool.query("UPDATE compartment_list SET name = $1 WHERE id = $2", [new_name, id]).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}
