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
	var type: main.bodyType = {
		fields: {
			"name": "string",
		},
		required: ["name"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return
	db_helper.add_room_to_db(req.body, exists => {
		if (exists)
			return res.status(400).send("The room you want to create exists already!")
		else
			res.status(200).send("ok")
	})
})

main.app.post("/room/delete", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
		},
		required: ["name"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.delete_room_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/room/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"old_name": "string",
		},
		required: ["name", "old_name"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.edit_room_in_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/shelf/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"room": "string",
		},
		required: ["name", "room"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
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
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"room": "string",
		},
		required: ["name", "room"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.delete_shelf_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/shelf/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"old_name": "string",
			"room": "string",
		},
		required: ["name", "old_name", "room"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.edit_shelf_in_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/compartment/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"shelf": "string",
			"room": "string",
		},
		required: ["name", "shelf", "room"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
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
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"shelf": "string",
			"room": "string",
		},
		required: ["name", "shelf", "room"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.delete_compartment_from_db(req.body, () => {
		res.status(200).send("ok")
	})
})

main.app.post("/compartment/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"name": "string",
			"old_name": "string",
			"shelf": "string",
			"room": "string",
		},
		required: ["name", "old_name", "shelf", "room"]
	}

	if (!(await main.check_request(type, PERMS.EditStor, req.body, req.headers, res)))
		return

	db_helper.edit_compartment_in_db(req.body, () => {
		res.status(200).send("ok")
	})
})


main.app.get("/storage/list", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

	if (!(await main.check_request(type, PERMS.ViewStor, req.body, req.headers, res)))
		return
	db_helper.get_storage_from_db(data => {
		res.send(JSON.stringify(data))
	})
})
