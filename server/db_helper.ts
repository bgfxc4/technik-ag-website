import {Db, MongoClient} from "mongodb"
import * as fs from "fs"
import * as uuid from "uuid"
import * as main from "./main"

const item_image_placeholder = fs.readFileSync("./imgs/item-placeholder-img.png").toString('base64')

var db:Db;

export function setup_mongodb() {
	MongoClient.connect(main.config.mongo_url).then(client => {
		db = client.db("technikag")
		console.log("[Database] connected to database!")
	})
}

export function add_equipment_to_db(body: any, callback: () => void) {
	db.collection("categories").findOne({name: body.category}, (err, data) => {
		if (err)
			throw err
		
		var custom_fields: {
			[key: string]: string;
		} = {}
		if (data)
			for (var f in body.custom_fields) {
				custom_fields[f] = body.custom_fields[f]
			}
		var equ: main.Equipment = {
			id: uuid.v4(),
			name: body.name,
			description: body.description,
			storage_place: body.storage_place,
			category: body.category,
			type: body.type,
			image: (body.image) ? body.image : item_image_placeholder,
			custom_fields: custom_fields
		}
		db.collection("equipment").insertOne(equ, err2 => {
			if (err2)
				throw err
			callback()
		})
	})
}

export function add_category_to_db(body: any, callback: (exists: boolean) => void) {
	var cat: main.Category = {
		name: body.name,
		types: [],
		custom_fields: body.custom_fields,
	}
	var query = { name: cat.name}
	db.collection("categories").find(query).toArray((err, data) => {
		if (err)
			throw err

		if (data == undefined || data.length != 0)
			return callback(true)
		
		db.collection("categories").insertOne(cat, err => {
			if (err)
				throw err
			callback(false)
		})
	})
}

export function add_type_to_db(body: any, callback: (code: number) => void) {
	var query = { name: body.category}
	db.collection("categories").find(query).toArray((err, data) => {
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
		db.collection("categories").updateOne({name: body.category}, {$set: {types: data[0].types}}, err => {
			if (err)
				throw err
			callback(0)
		})
	})
}

export function edit_equipment_in_db(body: any, callback: () => void) {
	db.collection("categories").findOne({name: body.category}, (err, data) => {
		if (err)
			throw err
		
		var custom_fields: {
			[key: string]: string;
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
				storage_place: body.storage_place,
				category: body.category,
				type: body.type,
				custom_fields: custom_fields,
				image: (body.image) ? body.image : item_image_placeholder
			}
		}
		db.collection("equipment").updateOne(query, update, err => {
			if (err)
				throw err
			callback()
		})
	})
}

export function delete_equipment_from_db(body: any, callback: () => void) {
	var query = {id: body.id}
	db.collection("equipment").deleteOne(query, err => {
		if (err)
			throw err
		callback()
	})
}

export function delete_category_from_db(body: any, callback: () => void) {
	db.collection("categories").deleteOne({name: body.name}, err => {
		if (err)
			throw err
		db.collection("equipment").deleteMany({category: body.name}, err2 => {
			if (err2)
				throw err2
			callback()
		})
	})
}

export function delete_type_from_db(body: any, callback: () => void) {
	db.collection("categories").findOne({name: body.category}, (err, data) => {
		if (err)
			throw err
		if (!data)
			return
		data.types.splice(data.types.indexOf(body.name), 1)
		db.collection("categories").updateOne({name: body.category}, {$set: {types: data.types}}, err2 => {
			if (err2)
				throw err2
			db.collection("equipment").deleteMany({category: body.category, type: body.name}, err3 => {
				if (err3)
					throw err3
				callback()
			})
		})
	})
}

export function get_equipment_from_db(callback: (res: any) => void) {
	db.collection("equipment").find().toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

export function get_categories_from_db(callback: (res: any) => void) {
	db.collection("categories").find().toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

export function get_equipment_by_id_from_db(id: string, callback: (res: any) => void) {
	db.collection("equipment").find().toArray((err, data) => {
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

export function get_equipment_by_type_from_db(category: string, type: string, callback: (res: any) => void) {
	db.collection("equipment").find({category: category, type: type}).toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}

export function check_if_category_exists(name: string, callback: (exists: boolean) => void) {
	db.collection("categories").find({name: name}).toArray((err, data) => {
		if (err)
			throw err
		if (data == undefined)
			return callback(false)
		if (data.length == 0)
			return callback(false)
		callback(true)
	})
}

export function check_if_type_exists(category: string, name: string, callback: (code: number) => void) {
	db.collection("categories").find({name: category}).toArray((err, data) => {
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
