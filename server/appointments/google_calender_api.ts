import {google} from "googleapis"  
import {config} from "../main"
import {Appointment} from "./routes"
import * as main from "../main"
import * as uuid from "uuid"

const SCOPES = 'https://www.googleapis.com/auth/calendar'

const jwtClient = new google.auth.JWT(
	config.google_calendar.client_email,
	undefined,
	config.google_calendar.private_key,
	SCOPES
)

const calendar = google.calendar("v3")

export async function get_all_request_events(): Promise<Appointment[]> {
	return calendar.events.list({
		auth: jwtClient,
		calendarId: config.google_calendar.calendar_id,
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

export async function get_event_from_calendar(id: string) {
	return calendar.events.get({
		auth: jwtClient,
		calendarId: config.google_calendar.calendar_id,
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
	let app = await get_event_from_calendar(id).catch(err => { throw err })
	app.id = "A"+uuid.v4()
	return main.db.collection("appointments").insertOne(app)
}

export async function delete_request_event(id: string) {
	return calendar.events.delete({
		auth: jwtClient,
		calendarId: config.google_calendar.calendar_id,
		eventId: id
	}).then(() => {
		return
	}).catch(err => {
		throw err
	})
}