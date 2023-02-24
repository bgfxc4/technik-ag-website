import * as db_helper from "./db_helper"
import * as main from "../main"
import * as appmnt_db_helper from "../appointments/db_helper"
import {PERMS} from "../permissions"
import { z } from "zod"
import * as t from "../types/inventory"
import * as st from "../types/storage"
import * as at from "../types/appointments"

export interface Equipment {
	id: string;
	name: string;
	description: string;
	room: string;
	shelf: string;
	compartment: string;
	category: string;
	type: string;
	amount: number;
	image: string;
	custom_fields: any;
}

export interface ExistingEquipment extends Equipment {
    id: t.ExistingItemID
}

export interface Category {
	name: string;
	image: string;
	types: string[];
	custom_fields: string[];
}

main.app.post("/equipment/new", async (req, res) => {
	let type = z.object({
		name: z.string(),
		description: z.string(),
		compartment: st.ZodExistingCompartmentID,
		type: t.ZodExistingTypeID,
		amount: z.number().positive(),
		custom_fields: z.record(z.string(), z.union([z.string(), z.boolean()])),
		image: z.string().optional(),
		id: t.ZodNewItemID.optional()
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return
    
    db_helper.add_equipment_to_db(checked_body.id, checked_body.name, checked_body.description, checked_body.amount,
        checked_body.compartment, checked_body.type, checked_body.custom_fields, checked_body.image).then(() => {
        res.status(200).send("ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/category/new", async (req, res) => {
	let type = z.object({
		name: z.string(),
		image: z.string().optional(),
		custom_fields: z.array(z.object({
			name: z.string(),
			type: z.string(),
			options: z.array(z.string()).nullable()
		}))
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_category_to_db(checked_body.name, checked_body.custom_fields, checked_body.image).then(exists => {
		if (!exists)
			res.status(200).send("ok")
		else
			res.status(400).send("A category with this name exists already!")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/type/new", async (req, res) => {
	let type = z.object({
		name: z.string(),
		category: t.ZodExistingCategoryID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.add_type_to_db(checked_body.name, checked_body.category).then(code => {
		if (code == 0)
			res.status(200).send("ok")
		else if (code == 1)
			res.status(400).send("The category you specified does not exist!")
		else
			res.status(400).send("A type with this name exists already in this category!")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/equipment/edit", async (req, res) => {
	let type = z.object({
		name: z.string(),
		description: z.string(),
		compartment: st.ZodExistingCompartmentID,
		type: t.ZodExistingTypeID,
		amount: z.number().positive(),
		custom_fields: z.record(z.string(), z.union([z.string(), z.boolean()])),
		image: z.string().optional(),
		id: t.ZodExistingItemID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.edit_equipment_in_db(checked_body.id, checked_body.name, checked_body.description, checked_body.amount, checked_body.custom_fields,
        checked_body.compartment, checked_body.type, checked_body.image).then(() => {
        res.status(200).send("ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/type/edit", async (req, res) => {
	let type = z.object({
        id: t.ZodExistingTypeID,
		new_name: z.string(),
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.edit_type_in_db(checked_body.id, checked_body.new_name).then(() => {
        res.status(200).send("ok")
    }).catch(err => {
        res.status(500).send(err)
    })

})

main.app.post("/category/edit", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingCategoryID,
		new_name: z.string().optional(),
		image: z.string().optional(),
		custom_fields: z.array(z.object({
			name: z.string(),
			type: z.string(),
			options: z.array(z.string()).nullable()
		})).optional()
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.edit_category_in_db(checked_body.id, checked_body.new_name, checked_body.custom_fields, checked_body.image).then(() => {
        res.status(200).send("ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/equipment/delete", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingItemID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	db_helper.delete_equipment_from_db(checked_body.id).then(() => {
		res.status(200).send("ok")
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.post("/category/delete", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingCategoryID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.delete_category_from_db(checked_body.id).then(() => {
        res.status(200).send("ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/type/delete", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingTypeID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.delete_type_from_db(checked_body.id).then(() => {
        res.status(200).send("ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

async function get_appointment_list(during_appointment?: undefined|at.ExistingAppointmentID): Promise<any[]> {
	var list: (Equipment & { available_amount?: number })[] = await db_helper.get_equipment_from_db()
	var cats = await db_helper.get_categories_from_db()
	var result: any[] = []

	var item_use_during_appmnt = (during_appointment) ? await appmnt_db_helper.get_item_use_during_appointment(during_appointment).catch(err => {throw err}) : {}

	for (var cat of cats) {
		var types = []
		
		for (var t of cat.types)
			types.push({name: t, equipment: []})

		result.push({name: cat.name, types: types, custom_fields: cat.custom_fields})
	}

	for (var equ of list) {
		for (var i = 0; i < result.length; i++) {
			if (result[i].name == equ.category) {
				for (var j = 0; j < result[i].types.length; j++) {
					if (result[i].types[j].name == equ.type) {

						if (during_appointment) {
							if (item_use_during_appmnt[equ.id as t.ExistingItemID])
								equ.available_amount = equ.amount - item_use_during_appmnt[equ.id as t.ExistingItemID]
							else {
								equ.available_amount = equ.amount	
							}
						}

						result[i].types[j].equipment.push(equ)
						continue
					}
				}
				continue
			}
		}
	}
	return result
}

main.app.get("/equipment/list", async (req, res) => {
	let type = z.object({})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	if (!(await main.check_request(type, PERMS.ViewInv, req.body, req.headers, res)))
		return
	get_appointment_list().then(list => res.send(JSON.stringify(list))).catch(err => res.status(500).send(err))
})

main.app.post("/equipment/list/duringappointment", async (req, res) => {
	let type = z.object({
		appointment: at.ZodExistingAppointmentID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewAppmnts | PERMS.ViewInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	get_appointment_list(checked_body.appointment).then(list => res.send(JSON.stringify(list))).catch(err => res.status(500).send(err))
})

main.app.post("/equipment/get/duringappointment", async (req, res) => {
	let type = z.object({
		appointment: at.ZodExistingAppointmentID,
		id: t.ZodExistingItemID
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewAppmnts | PERMS.ViewInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	let appmnt = await main.db_pool.query("SELECT id, date, end_date FROM appointment_list WHERE id = $1", [checked_body.appointment]).then(res => res.rows[0])
	if (!appmnt)
		return res.status(400).send(`The appointment with the ID ${checked_body.appointment} was not found.`)

	let item: ExistingEquipment & { available_amount?: number } = await db_helper.get_equipment_by_id_from_db(checked_body.id, true).then(res => res[0])
	if (!item)
		return res.status(400).send(`The item with the ID ${checked_body.id} was not found.`)
	
	var amount = await appmnt_db_helper.get_max_amount_of_item_for_appmnt(checked_body.appointment, item, appmnt.date, appmnt.end_date)
	item.available_amount = amount
	res.send(JSON.stringify(item))
})

main.app.get("/category/getimg/:id", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingCategoryID
	})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.None, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_category_by_id(checked_params.id).then(cat => {
		var img = Buffer.from(cat.image, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length
		});

		res.end(img)
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.get("/equipment/getimg/:id", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingItemID
	})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.None, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_equipment_by_id_from_db(checked_params.id, true).then(equ => {
		var img = Buffer.from(equ[0].image, 'base64');

		res.writeHead(200, {
			'Content-Type': 'image/png',
			'Content-Length': img.length
		});

		res.end(img)
	}).catch(err => {
		res.status(500).send(err)
	})
})

function fits_search(name: string, keywords: any[]) {
	for (var k of keywords) {
		if (name.toLowerCase().includes(k.toLowerCase()))
			return true
	}
	return false
}

main.app.post("/equipment/search", async (req, res) => {
	let type = z.object({
		keywords: z.string()
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewInv, req.body, req.headers, res)
	if (checked_body == undefined)
		return

	var list = await db_helper.get_equipment_from_db()
	var ret:any[] = []
	for (var item of list) {
		if (fits_search(item.name, checked_body.keywords.split(" ")))
			ret.push(item)
	}
	res.send(JSON.stringify(ret))
})

main.app.get("/categories/list", async (req, res) => {
	let type = z.object({})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewInv, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	var list = await db_helper.get_categories_from_db()
	res.send(JSON.stringify(list))
})

main.app.get("/equipment/byid/:id", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingItemID 
	})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewInv, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_equipment_by_id_from_db(checked_params.id).then(list => {
		var result: any[] = []
		for (var equ of list) {
			var category_exists = false
			for (var cat of result) {
				if (cat.name == equ.category) {
					category_exists = true
					cat.equipment.push(equ)
				}
			}
			if (!category_exists) {
				result.push({
					name: equ.category,
					equipment: [equ]
				})
			}
		}
		res.send(JSON.stringify(result))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.get("/equipment/byid/:id/appointmentbookings", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingItemID 
	})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewInv | PERMS.ViewAppmnts, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_appointments_of_item(checked_params.id).then(list => {
		res.send(JSON.stringify(list))
	}).catch(err => {
		res.status(500).send(err)
	})
})

main.app.get("/equipment/bytype/:type_id", async (req, res) => {
	let type = z.object({
		type_id: t.ZodExistingTypeID,
	})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewInv, req.params, req.headers, res)
	if (checked_params == undefined)
		return

	db_helper.get_equipment_by_type_from_db(checked_params.type_id).then(equ => {
		res.send(JSON.stringify(equ))
	}).catch(err => {
		res.status(500).send(err)
	})
})
