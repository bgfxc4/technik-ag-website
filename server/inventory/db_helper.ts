import * as fs from "fs"
import * as uuid from "uuid"
import * as main from "../main"
import * as inventory from "./routes"

const item_image_placeholder = fs.readFileSync("./imgs/item-placeholder-img.png").toString('base64')

async function isUnusedItemID (id: string): Promise<boolean> {
	if (id[0] != 'I')
		return false
	if (!uuid.validate(id.substr(1)))
		return false
	
	var data = await main.db.collection("equipment").find({id: id}).toArray()
	if (data.length != 0)
		return false

	return true
} 

export function add_equipment_to_db(body: any, callback: () => void) {
	main.db.collection("categories").findOne({name: body.category}, async (err, data) => {
		if (err)
			throw err
		
		var custom_fields: {
			[key: string]: object;
		} = {}
		if (data)
			for (var f in body.custom_fields) {
				custom_fields[f] = body.custom_fields[f]
			}
		var equ: inventory.Equipment = {
			id: "I"+uuid.v4(),
			name: body.name,
			description: body.description,
			room: body.room,
			shelf: body.shelf,
			compartment: body.compartment,
			category: body.category,
			type: body.type,
			amount: body.amount,
			image: (body.image) ? body.image : item_image_placeholder,
			custom_fields: custom_fields
		}

		if (body.id && (await isUnusedItemID(body.id))) { // check if body.id is valid item id that is not yet used, if so, use it as ID
			equ.id = body.id
		}

		main.db.collection("equipment").insertOne(equ, err2 => {
			if (err2)
				throw err
			callback()
		})
	})
}

export function add_category_to_db(body: any, callback: (exists: boolean) => void) {
	var cat: inventory.Category = {
		name: body.name,
		image: (body.image) ? body.image : item_image_placeholder,
		types: [],
		custom_fields: body.custom_fields,
	}
	var query = { name: cat.name}
	main.db.collection("categories").find(query).toArray((err, data) => {
		if (err)
			throw err

		if (data == undefined || data.length != 0)
			return callback(true)
		
		main.db.collection("categories").insertOne(cat, err => {
			if (err)
				throw err
			callback(false)
		})
	})
}

export function add_type_to_db(body: any, callback: (code: number) => void) {
	var query = { name: body.category}
	main.db.collection("categories").find(query).toArray((err, data) => {
		if (err)
			throw err

		if (data == undefined || data.length == 0)
			return callback(1)
		
		for (var t of data[0].types) {
			if (t == body.name) {
				callback(2)
				return
			}
		}
		data[0].types.push(body.name)
		main.db.collection("categories").updateOne({name: body.category}, {$set: {types: data[0].types}}, err => {
			if (err)
				throw err
			callback(0)
		})
	})
}

export function edit_equipment_in_db(body: any, callback: () => void) {
	main.db.collection("categories").findOne({name: body.category}, (err, data) => {
		if (err)
			throw err
		
		var custom_fields: {
			[key: string]: object;
		} = {}
		if (data)
			for (var f in body.custom_fields) {
				custom_fields[f] = body.custom_fields[f]
			}
		var query = { id: body.id}
		var update = {
			$set: {
				name: body.name,
				description: body.description,
				room: body.room,
				shelf: body.shelf,
				compartment: body.compartment,
				category: body.category,
				type: body.type,
				amount: body.amount,
				custom_fields: custom_fields,
				image: (body.image) ? body.image : item_image_placeholder
			}
		}
		main.db.collection("equipment").updateOne(query, update, err => {
			if (err)
				throw err
			callback()
		})
	})
}

export function edit_category_in_db(body: any, callback: () => void) {
	var query = { name: body.old_name }
	var update: any = {$set: {}}
	if (body.new_name)
		update.$set.name = body.new_name
	if (body.custom_fields)
		update.$set.custom_fields = body.custom_fields
	if (body.image)
		update.$set.image = body.image

	main.db.collection("categories").updateOne(query, update, err => {
		if (err)
			throw err
		if (!body.new_name && !body.custom_fields)
			return callback()
		
		// edit all the equipment of the category
		main.db.collection("equipment").find({category: body.old_name}).toArray(async (err, data) => {
			if (err)
				throw err
			if (!data)
				return callback()
			
			for (var item of data) {
				var update: any = {$set: {}}

				// if the users wants to set new custom field, loop through custom fields 
				// and only add the ones, that are in the request body
				if (body.custom_fields) {
					update.$set.custom_fields = {}
					for (var field in item.custom_fields) {
						if (body.custom_fields.filter((f:any) => f.name == field).length != 0) {
							update.$set.custom_fields[field] = item.custom_fields[field]
						}
					}
				}
				
				if (body.new_name) {
					update.$set.category = body.new_name
				}
				await main.db.collection("equipment").updateMany({category: body.old_name}, update)
			}
			callback()
		})
	})
}

export function edit_type_in_db(body: any, callback: () => void) {
	var query: any = { name: body.category }
	
	main.db.collection("categories").findOne(query, async (err, data) => {
		if (err)
			throw err
		
		if (!data)
			return

		data.types[data.types.indexOf(body.old_name)] = body.new_name
		var update: any = {
			$set: { types: data.types }
		}
		await main.db.collection("categories").updateOne(query, update)
		
		query = { category: body.category, type: body.old_name}
		update = {
			$set: { type: body.new_name }
		}
		await main.db.collection("equipment").updateMany(query, update)
		callback()
	})
}

export function delete_equipment_from_db(body: any, callback: () => void) {
	var query = {id: body.id}
	main.db.collection("equipment").deleteOne(query, err => {
		if (err)
			throw err
		callback()
	})
}

export function delete_category_from_db(body: any, callback: () => void) {
	main.db.collection("categories").deleteOne({name: body.name}, err => {
		if (err)
			throw err
		main.db.collection("equipment").deleteMany({category: body.name}, err2 => {
			if (err2)
				throw err2
			callback()
		})
	})
}

export function delete_type_from_db(body: any, callback: () => void) {
	main.db.collection("categories").findOne({name: body.category}, (err, data) => {
		if (err)
			throw err
		if (!data)
			return
		data.types.splice(data.types.indexOf(body.name), 1)
		main.db.collection("categories").updateOne({name: body.category}, {$set: {types: data.types}}, err2 => {
			if (err2)
				throw err2
			main.db.collection("equipment").deleteMany({category: body.category, type: body.name}, err3 => {
				if (err3)
					throw err3
				callback()
			})
		})
	})
}

export async function get_equipment_from_db(project={image: 0}): Promise<any[]> {
	return await main.db.collection("equipment").find().project(project).toArray()
}

export async function get_categories_from_db(project={image:0}): Promise<any[]> {
	return await main.db.collection("categories").find().project(project).toArray()
}

export function get_equipment_by_id_from_db(id: string, callback: (res: any) => void, project:any={image:0}) {
	main.db.collection("equipment").find().project(project).toArray((err, data) => {
		if (err) 
			throw err
		if (!data) {
			callback([])
			return
		}
		var ret = []
		for (var d of data) {
			if (d.id.startsWith(id))
				ret.push(d)
		}
		callback(ret)
	})
}

export function get_category_by_name(name: string, callback: (category: any) => void) {
	main.db.collection("categories").findOne({name: name}, (err, data) => {
		if (err)
			throw err
		if (data == undefined)
			return callback(undefined)
		callback(data)
	})
}

export function get_equipment_by_type_from_db(category: string, type: string, callback: (res: any) => void, project={image:0}) {
	main.db.collection("equipment").find({category: category, type: type}).project(project).toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

export function check_if_category_exists(name: string, callback: (exists: boolean) => void, project={image:0}) {
	main.db.collection("categories").find({name: name}).project(project).toArray((err, data) => {
		if (err)
			throw err
		if (data == undefined)
			return callback(false)
		if (data.length == 0)
			return callback(false)
		callback(true)
	})
}

export function check_if_type_exists(category: string, name: string, callback: (code: number) => void, project={image:0}) {
	main.db.collection("categories").find({name: category}).project(project).toArray((err, data) => {
		if (err)
			throw err
		if (data == undefined)
			return callback(1)
		if (data.length == 0)
			return callback(1)
		for (var t of data[0].types) {
			if (t == name) {
				callback(0)
				return
			}
		}
		callback(2)
	})
}

