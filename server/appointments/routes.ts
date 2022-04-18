import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"

export interface Appointment {
    id: string
    name: string
    description: string
    date: number
    end_date: number
    items: string[] // array of IDs
}

main.app.get("/appointments/list/approved", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

	if (!(await main.check_request(type, PERMS.ViewAppmnts, req.body, req.headers, res)))
		return
	db_helper.get_approved_appointments_from_db().then(data => {
		res.send(JSON.stringify(data))
	})
})

main.app.get("/appointments/list/requested", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

	if (!(await main.check_request(type, PERMS.ViewAppmnts, req.body, req.headers, res)))
		return
	db_helper.get_requested_appointments_from_db().then(data => {
		res.send(JSON.stringify(data))
	})
})

main.app.post("/appointments/request", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			name: "string",
			description: "string",
			date: "number",
			end_date: "number",
		},
		required: ["name", "description", "date", "end_date"]
	}

	if (!(await main.check_request(type, PERMS.RequestAppmnts, req.body, req.headers, res)))
		return
	db_helper.add_appointment_request_to_db(req.body).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/approve", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			id: "string",
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.EditAppmnts, req.body, req.headers, res)))
		return
	db_helper.approve_appmnt_in_db(req.body).then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})