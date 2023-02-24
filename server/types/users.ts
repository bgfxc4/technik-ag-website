import z from "zod"
import * as uuid from "uuid"
import { db_pool } from "../main"

export type NewUserID = string & {"NewUserID": {}}
export type ExistingUserID = string & {"ExistingUserID": {}}

export type NewGroupID = string & {"NewGroupID": {}}
export type ExistingGroupID = string & {"ExistingGroupID": {}}


export const ZodExistingUserID = z.string().refine(async val => {
    return db_pool.query("SELECT id from user_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no user in the DB with the ID you provided."
}).transform(val => val as ExistingUserID)

export const ZodNewUserID = z.string().refine(async val => {
    return db_pool.query("SELECT id from user_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already a user in the DB with the ID you provided."
}).refine(val => val[0] == 'U' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'U'+uuid v4>."
}).transform(val => val as NewUserID)


export const ZodExistingGroupID = z.string().refine(async val => {
    return db_pool.query("SELECT id from group_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no group in the DB with the ID you provided."
}).transform(val => val as ExistingGroupID)

export const ZodNewGroupID = z.string().refine(async val => {
    return db_pool.query("SELECT id from group_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already a group in the DB with the ID you provided."
}).refine(val => val[0] == 'G' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'G'+uuid v4>."
}).transform(val => val as NewGroupID)
