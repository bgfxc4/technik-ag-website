import * as db_helper from "./db_helper"
import * as main from "../main"

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

main.app.post("/new-room", (req, res) => {
	if (!main.check_request(['name'], true, req.body, res))
		return
	db_helper.add_room_to_db(req.body, exists => {
		if (exists)
			return res.status(400).send("The room you want to create exists already!")
		else
			res.status(200).send("ok")
	})
})

main.app.post("/delete-room", (req, res) => {
	if (!main.check_request(['name'], true, req.body, res))
		return

	db_helper.delete_room_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/new-shelf", (req, res) => {
	if (!main.check_request(['name', 'room'], true, req.body, res))
		return

	db_helper.add_shelf_to_db(req.body, code => {
		if (code == 1)
			return res.status(400).send("The room you want to create the shelf in does not exist!")
		if (code == 2)
			return res.status(400).send("The shelf you want to create does already exist!")
		
		res.status(200).send("ok")
	})
})

main.app.post("/delete-shelf", (req, res) => {
	if (!main.check_request(['name', 'room'], true, req.body, res))
		return

	db_helper.delete_shelf_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/new-compartment", (req, res) => {
	if (!main.check_request(['name', 'shelf', 'room'], true, req.body, res))
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

main.app.post("/delete-compartment", (req, res) => {
	if (!main.check_request(['name', 'shelf', 'room'], true, req.body, res))
		return

	db_helper.delete_compartment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.get("/get-storage", (req, res) => {
	db_helper.get_storage_from_db(data => {
		res.send(JSON.stringify(data))
	})
})
