import z from "zod"
import * as uuid from "uuid"
import { db_pool } from "../main"

export type ExistingItemID = string & {"ExistingItemID": {}}
export type NewItemID = string & {"NewItemID": {}}

export type NewCategoryID = string & {"NewCategoryID": {}}
export type ExistingCategoryID = string & {"ExistingCategoryID": {}}

export type NewTypeID = string & {"NewTypeID": {}}
export type ExistingTypeID = string & {"ExistingTypeID": {}}


export const ZodExistingItemID = z.string().refine(async val => {
    return db_pool.query("SELECT id from item_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no item in the DB with the ID you provided."
}).transform(val => val as ExistingItemID)

export const ZodNewItemID = z.string().refine(async val => {
    return db_pool.query("SELECT id from item_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already an item in the DB with the ID you provided."
}).refine(val => val[0] == 'I' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'I'+uuid v4>."
}).transform(val => val as NewItemID)


export const ZodExistingCategoryID = z.string().refine(async val => {
    return db_pool.query("SELECT id from category_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no category in the DB with the ID you provided."
}).transform(val => val as ExistingCategoryID)

export const ZodNewCategoryID = z.string().refine(async val => {
    return db_pool.query("SELECT id from category_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already a category in the DB with the ID you provided."
}).refine(val => val[0] == 'C' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'C'+uuid v4>."
}).transform(val => val as NewCategoryID)


export const ZodExistingTypeID = z.string().refine(async val => {
    return db_pool.query("SELECT id from type_list WHERE id = $1", [val]).then(res => {
        return res.rowCount != 0
    })
}, {
    message: "There is no type in the DB with the ID you provided."
}).transform(val => val as ExistingTypeID)

export const ZodNewTypeID = z.string().refine(async val => {
    return db_pool.query("SELECT id from type_list WHERE id = $1", [val]).then(res => {
        return res.rowCount == 0
    })
}, {
    message: "There is already a type in the DB with the ID you provided."
}).refine(val => val[0] == 'T' && uuid.validate(val.substring(1)), {
    message: "The ID you provided is not in the correct format <'T'+uuid v4>."
}).transform(val => val as NewTypeID)
