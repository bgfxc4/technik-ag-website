import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"

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
	if (!(await main.check_request(['name'], PERMS.EditStor, req.body, req.headers, res)))
		return
	db_helper.add_room_to_db(req.body, exists => {
		if (exists)
			return res.status(400).send("The room you want to create exists already!")
		else
			res.status(200).send("ok")
	})
})

main.app.post("/room/delete", async (req, res) => {
	if (!(await main.check_request(['name'], PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.delete_room_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/shelf/new", async (req, res) => {
	if (!(await main.check_request(['name', 'room'], PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.add_shelf_to_db(req.body, code => {
		if (code == 1)
			return res.status(400).send("The room you want to create the shelf in does not exist!")
		if (code == 2)
			return res.status(400).send("The shelf you want to create does already exist!")
		
		res.status(200).send("ok")
	})
})

main.app.post("/shelf/delete", async (req, res) => {
	if (!(await main.check_request(['name', 'room'], PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.delete_shelf_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/compartment/new", async (req, res) => {
	if (!(await main.check_request(['name', 'shelf', 'room'], PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.add_compartment_to_db(req.body, code => {
		if (code == 1)
			return res.status(400).send("The room you want to create the compartment in does not exist!")
		if (code == 2)
			return res.status(400).send("The shelf you want to create the compartment in does not exist!")
		if (code == 3)
			return res.status(400).send("The compartment you want to create does already exist!")
		
		res.status(200).send("ok")
	})
})

main.app.post("/compartment/delete", async (req, res) => {
	if (!(await main.check_request(['name', 'shelf', 'room'], PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.delete_compartment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.get("/storage/list", async (req, res) => {
	if (!(await main.check_request([], PERMS.ViewStor, req.body, req.headers, res)))
		return
	db_helper.get_storage_from_db(data => {
		res.send(JSON.stringify(data))
	})
})
