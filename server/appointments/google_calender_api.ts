import {calendar, auth, calendar_v3} from "@googleapis/calendar"  
import {config} from "../main"
import {Appointment} from "./routes"
import * as main from "../main"
import * as uuid from "uuid"

const SCOPES = 'https://www.googleapis.com/auth/calendar'

const jwtClient = new auth.JWT(
	config.google_calendar.client_email,
	undefined,
	config.google_calendar.private_key,
	SCOPES
)

const google_cal = calendar("v3")

export async function get_all_request_events(): Promise<Appointment[]> {
	return google_cal.events.list({
		auth: jwtClient,
		calendarId: config.google_calendar.request_calendar_id,
		singleEvents: true,
		orderBy: 'startTime',
	}).then(result => {
		if (result?.data?.items?.length) {
			return result.data.items.map(el => {
				let a: Appointment = {
					id: el.id || "Request ID",
					name: el.summary || "Request Name",
					description: el.description || "Request Description",
					contact: el.creator?.email || "",
					needed_items: "",
					date: new Date(el?.start?.dateTime || 0).getTime(),
					end_date: new Date(el?.end?.dateTime || 0).getTime(),
					items: [],
					from_google_calendar: true
				}
				return a
			})
		} else {
			return []
		}
 	}).catch(error => {
		throw error
	})
}

export async function get_event_from_google_cal(id: string, calendar_id: string) {
	return google_cal.events.get({
		auth: jwtClient,
		calendarId: calendar_id,
		eventId: id
	}).then(result => {
		let el = result.data
		let a: Appointment = {
			id: el.id || "Request ID",
			name: el.summary || "Request Name",
			description: el.description || "Request Description",
			contact: el.creator?.email || "",
			needed_items: "",
			date: new Date(el?.start?.dateTime || 0).getTime(),
			end_date: new Date(el?.end?.dateTime || 0).getTime(),
			items: [],
			from_google_calendar: true
		}
		return a
 	}).catch(error => {
		throw error
	})
}

export async function approve_request_to_db(id: string) {
	let app = await get_event_from_google_cal(id, config.google_calendar.request_calendar_id).catch(err => { throw err })
	app.id = "A"+uuid.v4()
	return main.db.collection("appointments").insertOne(app).then(() => {
		return app
	})
}

export async function delete_termin_event(id: string) {
	return delete_event(config.google_calendar.termin_calendar_id, id.split("-").join("").toLowerCase())
}

export async function delete_request_event(id: string) {
	return delete_event(config.google_calendar.request_calendar_id, id)
}

async function delete_event(google_cal_id: string, event_id: string) {
	return google_cal.events.delete({
		auth: jwtClient,
		calendarId: google_cal_id,
		eventId: event_id
	}).then(() => {
		return
	}).catch(err => {
		if (err.code == 410) return // if the event has been deleted on the google calendar, ignore the error
		throw err
	})
}

export async function add_appointment_to_appmnt_calendar(appointment: Appointment) {
	return add_appointment_to_calendar(config.google_calendar.termin_calendar_id, appointment)
}

async function add_appointment_to_calendar(calendar_id: string, appointment: Appointment) {
	return google_cal.events.insert({
		calendarId: calendar_id,
		auth: jwtClient,
		requestBody: {
			summary: appointment.name,
			description: appointment.description,
			start: {
				dateTime: new Date(appointment.date).toISOString()
			},
			end: {
				dateTime: new Date(appointment.end_date).toISOString()
			},
			id: appointment.id.split("-").join("").toLowerCase(),
			organizer: {displayName: appointment.contact}
		}
	}).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}