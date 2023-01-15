import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"
import * as google_cal from "./google_calender_api"

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
	var type: main.bodyType = {
		fields: {},
	}

	if (!(await main.check_request(type, PERMS.ViewAppmnts, req.body, req.headers, res)))
		return
	db_helper.get_approved_appointments_from_db().then(data => {
		res.send(JSON.stringify(data))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.get("/appointments/list/requested", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

	if (!(await main.check_request(type, PERMS.ViewAppmnts, req.body, req.headers, res)))
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
	var type: main.bodyType = {
		fields: {
			"id": "string"
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.EditAppmnts, req.body, req.headers, res)))
		return
	Promise.all([db_helper.delete_appointment_from_db(req.body),
				google_cal.delete_termin_event(req.body.id)]).then(() => {
		res.send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/delete/request", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			"id": "string",
			"from_google_calendar": "boolean"
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.EditAppmnts, req.body, req.headers, res)))
		return

	if (req.body.from_google_calendar) {
		google_cal.delete_request_event(req.body.id).then(() => {
			res.send("ok")
		}).catch(err => {
			res.status(500).send(err)
		})
	} else {
		db_helper.delete_requested_appointment_from_db(req.body).then(data => {
			res.send(data)
		}).catch(err => {
			res.status(500).send(err)
		})
	}
})

main.app.post("/appointments/request", async (req, res) => {
	var type: main.bodyType = {
		fields: {
			name: "string",
			description: "string",
			date: "number",
			end_date: "number",
			needed_items: "string",
			contact: "string",
		},
		required: ["name", "description", "date", "end_date", "contact"]
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
			from_google_calendar: "boolean"
		},
		required: ["id"]
	}

	if (!(await main.check_request(type, PERMS.EditAppmnts, req.body, req.headers, res)))
		return

	db_helper.approve_appmnt_in_db(req.body).then(data => {
		google_cal.add_appointment_to_appmnt_calendar(data).then(() => {
			res.send("ok")
		})
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/appointments/updateitems", async (req, res) => {
	var item:main.bodyType = {
		fields: {
			"id": "string",
			"amount": "number"
		},
		required: ["id", "amount"]
	}
	var type: main.bodyType = {
		fields: {
			id: "string",
			items: main.array(item)
		},
		required: ["id", "items"]
	}
	if (!(await main.check_request(type, PERMS.EditAppmnts, req.body, req.headers, res)))
		return
	db_helper.update_appmnt_items_in_db(req.body).then(() => {
		res.send("ok")
	}).catch(err => {
		console.log(err)
		res.status(500).send(err)
	})
})

main.app.post("/appointments/edit", async (req, res) => {
	var type:main.bodyType = {
		fields: {
			"id": "string",
			"name": "string",
			"date": "number",
			"end_date": "number",
			"description": "string",
			"contact": "string",
		},
		required: ["id"]
	}
	if (!(await main.check_request(type, PERMS.EditAppmnts, req.body, req.headers, res)))
		return
	db_helper.update_appmnt_in_db(req.body).then(() => {
		res.send("ok")
	}).catch(err => {
		console.log(err)
		res.status(500).send(err)
	})
})