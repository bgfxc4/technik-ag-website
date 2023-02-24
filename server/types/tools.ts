import z from "zod"
import { db_pool } from "../main"

export type ExistingChecklistID = number & {"ExistingchecklistID": {}}

export type ExistingChecklistItemID = number & {"ExistingchecklistItemID": {}}


export const ZodExistingChecklistID = z.number().refine(async val => {
    return db_pool.query("SELECT id from checklist_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no checklist in the DB with the ID you provided."
}).transform(val => val as ExistingChecklistID)


export const ZodExistingChecklistItemID = z.number().refine(async val => {
    return db_pool.query("SELECT id from checklist_items WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no checklist item in the DB with the ID you provided."
}).transform(val => val as ExistingChecklistItemID)
