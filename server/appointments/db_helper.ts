import * as main from "../main"
import * as uuid from "uuid"
import * as t from "../types/appointments"
import * as it from "../types/inventory"
import { Appointment } from "./routes"

const get_appointment_query = `SELECT id, name, contact, description, date, end_date, needed_items,
            (
                SELECT array_to_json(array_agg(row_to_json(i)))
                FROM (
                    SELECT appointment_item_bookings.amount, item_id as id, name
                    FROM appointment_item_bookings
                    LEFT JOIN item_list ON item_list.id = item_id
                    WHERE appointment_item_bookings.appointment_id = appointment_list.id
                ) i
            ) as items
        FROM appointment_list`

export async function get_approved_appointments_from_db(): Promise<Appointment[]> {
    return main.db_pool.query(get_appointment_query).then(res => {
        return res.rows.map(el => {el.date = Number(el.date); el.end_date = Number(el.end_date); return el})
    }).catch(err => {
        throw err
    })
}

export async function get_requested_appointments_from_db(): Promise<Appointment[]> {
    const query = `SELECT id, name, contact, description, date, end_date, needed_items
                FROM appointment_request_list`
    return main.db_pool.query(query).then(res => {
        return res.rows.map(el => {el.date = Number(el.date); el.end_date = Number(el.end_date); return el})
    }).catch(err => {
        throw err
    })
}

export async function delete_appointment_from_db(id: t.ExistingAppointmentID): Promise<void> {
    return main.db_pool.query("DELETE FROM appointment_list WHERE id = $1", [id]).then(_ => {
        return
    }).catch(err => {
        throw err
    })
}

export async function delete_requested_appointment_from_db(id: t.ExistingAppointmentRequestID): Promise<void> {
    return main.db_pool.query("DELETE FROM appointment_request_list WHERE id = $1", [id]).then(_ => {
        return
    }).catch(err => {
        throw err
    })
} 

export async function add_appointment_request_to_db(name: string, description: string, date: number, end_date: number, contact: string, needed_items?: string): Promise<void> {
    const query = `INSERT INTO appointment_request_list (id, name, description, date, end_date, contact, needed_items)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`
    return main.db_pool.query(query, ["A"+uuid.v4(), name, description, date, end_date, contact, needed_items||""]).then(_ => {
        return
    }).catch(err => {
        throw err
    })
}

export async function approve_appmnt_in_db(id: t.ExistingAppointmentRequestID): Promise<object> {
    await main.db_pool.query(`INSERT INTO appointment_list (id, name, description, date, end_date, contact, needed_items)
                            SELECT id, name, description, date, end_date, contact, needed_items
                            FROM appointment_request_list
                            WHERE id = $1`, [id])

    await main.db_pool.query(`DELETE FROM appointment_request_list
                            WHERE id = $1`, [id])
    return main.db_pool.query(get_appointment_query+` WHERE appointment_list.id = $1`, [id]).then(res => {
        res.rows[0].date = Number(res.rows[0]?.date)
        res.rows[0].end_date = Number(res.rows[0]?.end_date)
        return res.rows[0]
    }).catch(err => {
        console.log(err)
        throw err
    })
}

export async function get_item_use_during_appointment(appmnt_id: t.ExistingAppointmentID): Promise<{[key: it.ExistingItemID]: number}> {
    var appmnt = await main.db_pool.query(get_appointment_query+` WHERE appointment_list.id = $1`, [appmnt_id]).then(res => res.rows[0])
    if (!appmnt)
        throw new Error("The appointment with the ID you provided does not exist!")
    //var appmnts = await main.db.collection("appointments").find({date: {$lt: appmnt.end_date}, end_date: {$gt: appmnt.date}, id: {$ne: appmnt_id}}).toArray() // get all appmnts that are during the appmnt to check, but not itself
    let appmnts: {items: {amount: number, id: it.ExistingItemID}[], date: number, end_date: number}[] = await main.db_pool.query(get_appointment_query+` WHERE appointment_list.date < $1 AND appointment_list.end_date > $2 AND appointment_list.id <> $3`,
            [appmnt.end_date, appmnt.date, appmnt_id]).then(res => res.rows)

    let orderd: {items: {amount: number, id: it.ExistingItemID}[], time: number}[] = []
    for (var a of appmnts) {
        orderd.push({items: a.items, time: a.date})
        orderd.push({items: a.items.map(i => {return {amount: i.amount * -1, id: i.id}}), time: a.end_date})
    }

    orderd.sort((a, b) => a.time - b.time)

    let max_amounts: {[key: it.ExistingItemID]: number} = {}
    let amounts: {[key: it.ExistingItemID]: number} = {}

    for (let o of orderd) { // run through all appmnts and "simulate" them to get max used amount at one time
        for (let i of o.items) {
            if (!amounts[i.id]) {
                amounts[i.id] = 0
                max_amounts[i.id] = 0
            }

            amounts[i.id] += i.amount

            if (amounts[i.id] > max_amounts[i.id])
                max_amounts[i.id] = amounts[i.id]
        }
    }

    return max_amounts
}

export async function get_max_amount_of_item_for_appmnt(appmnt_id: t.ExistingAppointmentID, item: {id: it.ExistingItemID, amount: number}, date: number, end_date: number): Promise<number> {
    //var appmnts = await main.db.collection("appointments").find({items: {$elemMatch: {id: item.id}}, date: {$lt: end_date}, end_date: {$gt: date}, id: {$ne: appmnt_id}}).toArray() // get all appmnts that have the item booked that are during the appmnt to check, but not itself
    const query = get_appointment_query + 
        ` LEFT JOIN (SELECT appointment_id, item_id FROM appointment_item_bookings) bookings
        ON bookings.appointment_id = appointment_list.id

        WHERE bookings.item_id = $1 AND
        appointment_list.date < $2 AND appointment_list.end_date > $3 AND appointment_list.id <> $4`
    let appmnts = await main.db_pool.query(query, [item.id, end_date, date, appmnt_id]).then(res => res.rows)

    for (var a of appmnts) {
        a.item = a.items[a.items.findIndex((e: {id: string}) => e.id == item.id)] // move the item that has to be checked outside of the array so it is easier to be found
    }

    var orderd: {amount: number, time: number}[] = []
    for (var a of appmnts) {
        orderd.push({amount: a.item.amount, time: a.date})
        orderd.push({amount: -a.item.amount, time: a.end_date})
    }

    orderd.sort((a, b) => a.time - b.time)

    var max_amount = 0;
    var amount = 0;
    for (var o of orderd) { // run through all appmnts and "simulate" them to get max used amount at one time
        amount += o.amount

        if (amount > max_amount)
            max_amount = amount
    }

    return item.amount - max_amount
}

export async function update_appmnt_items_in_db(id: t.ExistingAppointmentID, items: {id: it.ExistingItemID, amount: number}[]):Promise<void> {
    //var appmnt = await main.db.collection("appointments").findOne({id: body.id}).catch(err => {throw err})
    let appmnt = await main.db_pool.query(get_appointment_query+` WHERE appointment_list.id = $1`, [id]).then(res => res.rows[0]).catch(err => {throw err})
    if (!appmnt)
        throw new Error(`The appointment with the ID ${id} was not found.`)

    for (var i of items) {
        //var item = await main.db.collection("equipment").findOne({id: i.id})
        let item = await main.db_pool.query("SELECT id, amount FROM item_list WHERE id = $1", [i.id]).then(res => res.rows[0])
        if (!item)
            throw new Error(`The item with the ID ${i.id} was not found.`)
        
        if (await get_max_amount_of_item_for_appmnt(appmnt.id, item, appmnt.date, appmnt.end_date) < i.amount)
            throw new Error(`You used an amount of the item ${i.id} that is not available during the appointment.`)
    }
    //await main.db.collection("appointments").updateOne({id: body.id}, {$set: {items: body.items}}).catch(err => {throw err})
    await main.db_pool.query("DELETE FROM appointment_item_bookings WHERE appointment_id = $1", [id]).catch(err => {throw err})
    let all_proms: Promise<void>[] = []
    items.forEach(el => {
        all_proms.push(main.db_pool.query("INSERT INTO appointment_item_bookings (appointment_id, item_id, amount) VALUES ($1, $2, $3)", [id, el.id, el.amount]).then(() => { return }))
    });
    await Promise.all(all_proms)
}

export async function update_appmnt_in_db(id: t.ExistingAppointmentID, name?: string, date?: number, end_date?: number, description?: string, contact?: string): Promise<void> {
    let query = "UPDATE appointment_list SET"
	let args = []
	if (name) {
		args.push(name)
		query += ` name = $${args.length},`
	}
	if (date) {
		args.push(date)
		query += ` date = $${args.length},`
	}
	if (end_date) {
		args.push(end_date)
		query += ` end_date = $${args.length},`
	}
	if (description) {
		args.push(description)
		query += ` description = $${args.length},`
	}
	if (contact) {
		args.push(contact)
		query += ` contact = $${args.length},`
	}
	query = query.slice(0, -1) // remove trailing , at the end
	args.push(id)
	query += ` WHERE id = $${args.length}`

	return main.db_pool.query(query, args).then(_ => {
		return
	}).catch(err => {
		throw err
	})
}
