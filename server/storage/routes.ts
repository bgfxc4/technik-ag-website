import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"
import { z } from "zod"
import * as t from "../types/storage"

export interface Room {
	name: string,
	shelfs: Shelf[]
}

export interface Shelf {
	name: string,
	compartments: Compartment[]
}

export interface Compartment {
	name: string
}

main.app.post("/room/new", async (req, res) => {
	let type = z.object({
		name: z.string(),
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_room_to_db(checked_body.name).then(_ => {
		res.send("The room you want to create exists already!")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/room/delete", async (req, res) => {
	let type = z.object({
	    id: t.ZodExistingRoomID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.delete_room_from_db(checked_body.id).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/room/edit", async (req, res) => {
	let type = z.object({
		name: z.string(),
	    id: t.ZodExistingRoomID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.edit_room_in_db(checked_body.id, checked_body.name).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/shelf/new", async (req, res) => {
	let type = z.object({
		name: z.string(),
		room: t.ZodExistingRoomID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_shelf_to_db(checked_body.room, checked_body.name).then(_code => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/shelf/delete", async (req, res) => {
	let type = z.object({
        id: t.ZodExistingShelfID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.delete_shelf_from_db(checked_body.id).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/shelf/edit", async (req, res) => {
	let type = z.object({
		name: z.string(),
        id: t.ZodExistingShelfID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.edit_shelf_in_db(checked_body.id, checked_body.name).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/compartment/new", async (req, res) => {
	let type = z.object({
        shelf: t.ZodExistingShelfID,
		name: z.string(),
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_compartment_to_db(checked_body.shelf, checked_body.name).then(_code => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/compartment/delete", async (req, res) => {
	let type = z.object({
        id: t.ZodExistingCompartmentID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.delete_compartment_from_db(checked_body.id).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/compartment/edit", async (req, res) => {
	let type = z.object({
		name: z.string(),
        id: t.ZodExistingCompartmentID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditStor, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.edit_compartment_in_db(checked_body.id, checked_body.name).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})


main.app.get("/storage/list", async (req, res) => {
	let type = z.object({})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewStor, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_storage_from_db().then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})
