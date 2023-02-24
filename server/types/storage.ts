import z from "zod"
import { db_pool } from "../main"

export type ExistingRoomID = number & {"ExistingRoomID": {}}

export type ExistingShelfID = number & {"ExistingShelfID": {}}
 
export type ExistingCompartmentID = number & {"ExistingCompartmentID": {}}


export const ZodExistingRoomID = z.number().refine(async val => {
    return db_pool.query("SELECT id from room_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no room in the DB with the ID you provided."
}).transform(val => val as ExistingRoomID)


export const ZodExistingShelfID = z.number().refine(async val => {
    return db_pool.query("SELECT id from shelf_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no shelf in the DB with the ID you provided."
}).transform(val => val as ExistingShelfID)


export const ZodExistingCompartmentID = z.number().refine(async val => {
    return db_pool.query("SELECT id from compartment_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no compartment in the DB with the ID you provided."
}).transform(val => val as ExistingCompartmentID)
