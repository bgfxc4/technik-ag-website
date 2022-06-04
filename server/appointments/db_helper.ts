import * as main from "../main"
import * as appmnts from "./routes"
import * as uuid from "uuid"

export async function get_approved_appointments_from_db() {
    return await main.db.collection("appointments").find({}).toArray().then(data => {
        return data
    }).catch(err => {
        console.error("Error occured in 'get_approved_appointments':")
        console.error(err)
        return []
    })
}

export async function get_requested_appointments_from_db() {
    return await main.db.collection("requested_appointments").find({}).toArray().then(data => {
        return data
    }).catch(err => {
        console.error("Error occured in 'get_requested_appointments':")
        console.error(err)
        return []
    })
}

export async function delete_appointment_from_db(body: any) {
    return await main.db.collection("appointments").deleteOne({id: body.id}).then(() => {
        return "ok"
    }).catch(err => {
        console.error("Error occured in 'delete_appointment':")
        console.error(err)
        throw err
    })
}

export async function delete_requested_appointment_from_db(body: any) {
    return await main.db.collection("requested_appointments").deleteOne({id: body.id}).then(() => {
        return "ok"
    }).catch(err => {
        console.error("Error occured in 'delete_requested_appointment':")
        console.error(err)
        throw err
    })
} 

export async function add_appointment_request_to_db(body: any) {
    var appmnt :appmnts.Appointment = {
        id: "A"+uuid.v4(),
        name: body.name,
        description: body.description,
        date: body.date,
        end_date: body.end_date,
        contact: body.contact,
        needed_items: body.needed_items,
        items: []
    }
    return await main.db.collection("requested_appointments").insertOne(appmnt).then(() => {
        return "ok"
    }).catch(err => {
        console.error("Error occured in 'add_appointment_request':")
        console.error(err)
        throw err
    })
}

export async function approve_appmnt_in_db(body: any) {
    return await main.db.collection("requested_appointments").findOne({id: body.id}).then(async data => {
        if (!data)
            throw "An request with this id does not exist!"

        var delProm = main.db.collection("requested_appointments").deleteOne({id: body.id})
        var insProm = main.db.collection("appointments").insertOne(data)
        await Promise.all([delProm, insProm])

        return "ok"
    }).catch(err => {
        throw err
    })
}

export async function get_item_use_during_appointment(appmnt_id: string): Promise<{[key: string]: number}> {
    var appmnt = await main.db.collection("appointments").findOne({id: appmnt_id})
    if (!appmnt)
        throw new Error("The appointment with the ID you provided does not exist!")
    var appmnts = await main.db.collection("appointments").find({date: {$lt: appmnt.end_date}, end_date: {$gt: appmnt.date}, id: {$ne: appmnt_id}}).toArray() // get all appmnts that are during the appmnt to check, but not itself

    var orderd: {items: any[], time: number}[] = []
    for (var a of appmnts) {
        orderd.push({items: a.items, time: a.date})
        orderd.push({items: a.items.map((i:any) => {return {amount: i.amount * -1, id: i.id}}), time: a.end_date})
    }

    orderd.sort((a, b) => a.time - b.time)

    var max_amounts: {[key: string]: number} = {}
    var amounts: {[key: string]: number} = {}

    for (var o of orderd) { // run through all appmnts and "simulate" them to get max used amount at one time
        for (var i of o.items) {
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

export async function get_max_amount_of_item_for_appmnt(appmnt_id: string, item: any, date: number, end_date: number): Promise<number> {
    var appmnts = await main.db.collection("appointments").find({items: {$elemMatch: {id: item.id}}, date: {$lt: end_date}, end_date: {$gt: date}, id: {$ne: appmnt_id}}).toArray() // get all appmnts that have the item booked that are during the appmnt to check, but not itself

    for (var a of appmnts) {
        a.item = a.items[a.items.findIndex((e:any) => e.id == item.id)] // move the item that has to be checked outside of the array so it is easier to be found
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

export async function update_appmnt_items_in_db(body: any):Promise<void> {
    var appmnt = await main.db.collection("appointments").findOne({id: body.id}).catch(err => {throw err})
    if (!appmnt)
        throw new Error(`The appointment with the ID ${body.id} was not found.`)

    for (var i of body.items) {
        var item = await main.db.collection("equipment").findOne({id: i.id})
        if (!item)
            throw new Error(`The item with the ID ${i.id} was not found.`)
        
        if (await get_max_amount_of_item_for_appmnt(appmnt.id, item, appmnt.date, appmnt.end_date) < i.amount)
            throw new Error(`You used an amount of the item ${i.id} that is not available during the appointment.`)
    }
    await main.db.collection("appointments").updateOne({id: body.id}, {$set: {items: body.items}}).catch(err => {throw err})
}