import z from "zod"
import * as uuid from "uuid"
import { db_pool } from "../main"

export type NewAppointmentID = string & {"NewAppointmentID": {}}
export type ExistingAppointmentID = string & {"ExistingAppointmentID": {}}

export type NewAppointmentRequestID = string & {"NewAppointmentRequstID": {}}
export type ExistingAppointmentRequestID = string & {"ExistingAppointmentRequestID": {}}


export const ZodExistingAppointmentID = z.string().refine(async val => {
    return db_pool.query("SELECT id from appointment_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no appointment in the DB with the ID you provided."
}).transform(val => val as ExistingAppointmentID)

export const ZodNewAppointmentID = z.string().refine(async val => {
    return db_pool.query("SELECT id from appointment_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already an appointment in the DB with the ID you provided."
}).refine(val => val[0] == 'A' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'A'+uuid v4>."
}).transform(val => val as NewAppointmentID)


export const ZodExistingAppointmentRequestID = z.string().refine(async val => {
    return db_pool.query("SELECT id from appointment_request_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no appointment in the DB with the ID you provided."
}).transform(val => val as ExistingAppointmentRequestID)

export const ZodNewAppointmentRequestID = z.string().refine(async val => {
    return db_pool.query("SELECT id from appointment_request_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already an appointment in the DB with the ID you provided."
}).refine(val => val[0] == 'A' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'A'+uuid v4>."
}).transform(val => val as NewAppointmentRequestID)
