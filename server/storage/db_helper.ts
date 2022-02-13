import * as main from "../main"
import * as storage from "./routes"

export function get_storage_from_db(callback: (res: any) => void) {
	main.db.collection("storage").find().toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

export function add_room_to_db(body: any, callback: (exists: boolean) => void) {
	var room: storage.Room = {
		name: body.name,
		shelfs: []
	}
	var query = { name: room.name}
	main.db.collection("storage").find(query).toArray((err, data) => {
		if (err)
			throw err

		if (data == undefined || data.length != 0)
			return callback(true)
		
		main.db.collection("storage").insertOne(room, err => {
			if (err)
				throw err
			callback(false)
		})
	})
}

export function delete_room_from_db(body: any, callback: () => void) {
	main.db.collection("storage").deleteOne({name: body.name}, err => {
		if (err)
			throw err
		callback()
	})
}

export function add_shelf_to_db(body: any, callback: (code: number) => void) {
	var query = { name: body.room}
	main.db.collection("storage").findOne(query, (err, data) => {
		if (err)
			throw err

		if (data == undefined)
			return callback(1)
		
		var shelf_index = -1
		for (var i = 0; i < data.shelfs.length; i++) {
			if (data.shelfs[i].name == body.name) {
				shelf_index = i
				break
			}
		}
		if (shelf_index != -1)
			return callback(2)
		
		var shelf: storage.Shelf = {
			name: body.name,
			compartments: []
		}
		data.shelfs.push(shelf)
		var update = {
			$set: {
				shelfs: data.shelfs
			}
		}
		main.db.collection("storage").updateOne(query, update, err => {
			if (err)
				throw err
			callback(0)
		})
	})
}

export function delete_shelf_from_db(body: any, callback: () => void) {
	main.db.collection("storage").findOne({name: body.room}, (err, data) => {
		if (err)
			throw err
		if (!data)
			return callback()
		
		for (var i in data.shelfs) {
			if (data.shelfs[i].name == body.name) {
				data.shelfs.splice(i, 1)
				break
			}
		}
		var update = {
			$set: {
				shelfs: data.shelfs
			}
		}
		main.db.collection("storage").updateOne({name: body.room}, update, err => {
			if (err)
				throw err
			callback()
		})
	})
}

export function add_compartment_to_db(body: any, callback: (code: number) => void) {
	var query = { name: body.room}
	main.db.collection("storage").findOne(query, (err, data) => {
		if (err)
			throw err

		if (data == undefined)
			return callback(1)
		
		var shelf_index = -1
		for (var i = 0; i < data.shelfs.length; i++) {
			if (data.shelfs[i].name == body.shelf) {
				shelf_index = i
				break
			}
		}
		if (shelf_index == -1)
			return callback(2)
		
		for (var c of data.shelfs[shelf_index].compartments) {
			if (c.name == body.name)
				return callback(3)
		}

		var comp: storage.Compartment = {
			name: body.name,
		}
		data.shelfs[shelf_index].compartments.push(comp)
		var update = {
			$set: {
				shelfs: data.shelfs
			}
		}
		main.db.collection("storage").updateOne(query, update, err => {
			if (err)
				throw err
			callback(0)
		})
	})
}

export function delete_compartment_from_db(body: any, callback: () => void) {
	main.db.collection("storage").findOne({name: body.room}, (err, data) => {
		if (err)
			throw err
		if (!data)
			return callback()
		
		for (var i in data.shelfs) {
			if (data.shelfs[i].name == body.shelf) {
				for (var j in data.shelfs[i].compartments) {
					if (data.shelfs[i].compartments[j].name == body.name) {
						data.shelfs[i].compartments.splice(j, 1)
						break
					}
				}
			}
		}
		var update = {
			$set: {
				shelfs: data.shelfs
			}
		}
		main.db.collection("storage").updateOne({name: body.room}, update, err => {
			if (err)
				throw err
			callback()
		})
	})
}

export async function compartment_exists(room: string, shelf: string, compartment: string, callback: (exists: boolean) => void) {
	var query = { "name": room, "shelfs.name": shelf, "shelfs.compartments.name": compartment }
	var count = await main.db.collection("storage").countDocuments(query, {limit: 1})
	if (count == 0)
		callback(false)
	else
		callback(true)
}
