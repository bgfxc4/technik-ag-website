import * as db_helper from "./db_helper"
import * as main from "../main"
import { z } from "zod"
import {PERMS} from "../permissions"

export interface ChecklistItem {
	id: string,
	name: string,
	checked: boolean
}

export interface Checklist {
	id: string,
	name: string,
	items: ChecklistItem[]
}

main.app.get("/tools/checklists/list/", async (req, res) => {
	let type = z.object({})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewChecklists, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_checklists_from_db().then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/new/", async (req, res) => {
	let type = z.object({
		name: z.string(),
		items: z.array(z.string())
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditChecklists, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_checklist_to_db(checked_body.name, checked_body.items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/delete/", async (req, res) => {
	let type = z.object({
		id: z.number().positive(),
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditChecklists, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.delete_checklist(checked_body.id).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/newItems/", async (req, res) => {
	let type = z.object({
		id: z.number().positive(),
		items: z.array(z.string())
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditChecklists, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_items_to_checklist(checked_body.id, checked_body.items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/deleteItems/", async (req, res) => {
	let type = z.object({
		id: z.number().positive(),
		items: z.array(z.number().positive())
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditChecklists, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.delete_items_from_checklist(checked_body.id, checked_body.items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/tools/checklists/setItemsChecked/", async (req, res) => {
	let type = z.object({
		id: z.number().positive(),
		items: z.array(z.number().positive()),
		checked_list: z.array(z.boolean())
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditChecklists, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.set_items_checked(checked_body.id, checked_body.items, checked_body.checked_list).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})
