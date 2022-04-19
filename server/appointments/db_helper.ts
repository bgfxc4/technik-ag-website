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