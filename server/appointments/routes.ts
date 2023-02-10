import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"
import * as google_cal from "./google_calender_api"
import { z } from "zod"

export interface Appointment {
    id: string
    name: string
    description: string
	contact: string
	needed_items: string
    date: number
    end_date: number
    items: {id: string, amount: number}[],
	from_google_calendar?: boolean
}

main.app.get("/appointments/list/approved", async (req, res) => {
	let type = z.object({})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return
	
	db_helper.get_approved_appointments_from_db().then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.get("/appointments/list/requested", async (req, res) => {
	let type = z.object({})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	Promise.all([
		db_helper.get_requested_appointments_from_db()
	]).then(vals => {
		res.send(JSON.stringify(vals.flat()))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/delete/approved", async (req, res) => {
	let type = z.object({
		id: z.string()
	})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return
	Promise.all([db_helper.delete_appointment_from_db(checked_body.id),
				google_cal.delete_termin_event(checked_body.id)]).then(() => {
		res.send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/delete/request", async (req, res) => {
	let type = z.object({
		id: z.string(),
		from_google_calendar: z.boolean().optional()
	})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	if (checked_body.from_google_calendar) {
		google_cal.delete_request_event(checked_body.id).then(() => {
			res.send("ok")
		}).catch(err => {
			res.status(500).send(err)
		})
	} else {
		db_helper.delete_requested_appointment_from_db(checked_body.id).then(data => {
			res.send(data)
		}).catch(err => {
			res.status(500).send(err)
		})
	}
})

main.app.post("/appointments/request", async (req, res) => {
	let type = z.object({
		name: z.string(),
		description: z.string(),
		date: z.number().positive(),
		end_date: z.number().positive(),
		contact: z.string(),
		needed_items: z.string().optional()
	})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.RequestAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_appointment_request_to_db(checked_body.name, checked_body.description, checked_body.date, checked_body.end_date, checked_body.contact, checked_body.needed_items).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/approve", async (req, res) => {
	let type = z.object({
		id: z.string(),
	})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.approve_appmnt_in_db(checked_body.id).then(data => {
		google_cal.add_appointment_to_appmnt_calendar(data as Appointment).then(() => {
			res.send("ok")
		})
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/updateitems", async (req, res) => {
	let type = z.object({
		id: z.string(),
		items: z.array(z.object({ id: z.string(), amount: z.number().positive() }))
	})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.update_appmnt_items_in_db(checked_body.id, checked_body.items).then(() => {
		res.send("ok")
	}).catch(err => {
		console.log(err)
		res.status(500).send(err)
	})
})

main.app.post("/appointments/edit", async (req, res) => {
	let type = z.object({
		id: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		date: z.number().positive().optional(),
		end_date: z.number().positive().optional(),
		contact: z.string().optional(),
	})
	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditAppmnts, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.update_appmnt_in_db(checked_body.id, checked_body.name, checked_body.date, checked_body.end_date, checked_body.description, checked_body.contact).then(() => {
		res.send("ok")
	}).catch(err => {
		console.log(err)
		res.status(500).send(err)
	})
})
