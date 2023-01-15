import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"

main.app.get("/tools/checklists/list/", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

	if (!(await main.check_request(type, PERMS.ViewChecklists, req.body, req.headers, res)))
		return
	db_helper.get_checklists_from_db().then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/new/", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "name": "string",
            "items": main.array("string")
        },
        required: ["name", "items"]
	}

	if (!(await main.check_request(type, PERMS.EditChecklists, req.body, req.headers, res)))
		return
	db_helper.add_checklist_to_db(req.body.name, req.body.items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/delete/", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "number",
        },
        required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.EditChecklists, req.body, req.headers, res)))
		return
	db_helper.delete_checklist(req.body.id).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/newItems/", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "items": main.array("string")
        },
        required: ["id", "items"]
	}

	if (!(await main.check_request(type, PERMS.EditChecklists, req.body, req.headers, res)))
		return
	db_helper.add_items_to_checklist(req.body.id, req.body.items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/deleteItems/", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "items": main.array("string")
        },
        required: ["id", "items"]
	}

	if (!(await main.check_request(type, PERMS.EditChecklists, req.body, req.headers, res)))
		return
	db_helper.delete_items_from_checklist(req.body.id, req.body.items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/setItemsChecked/", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "number",
            "items": main.array("number"),
            "checked_list": main.array("boolean")
        },
        required: ["id", "items", "checked_list"]
	}

	if (!(await main.check_request(type, PERMS.EditChecklists, req.body, req.headers, res)))
		return
	db_helper.set_items_checked(req.body.id, req.body.items, req.body.checked_list).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})