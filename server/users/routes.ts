import * as db_helper from "./db_helper"
import * as main from "../main"
import { z } from "zod"
import { PERMS } from "../permissions"
import * as t from "../types/users"

export interface User {
    display_name: string,
    login_hash: string,
    permissions: number,
    id: string,
    group_id: string
}

export interface Group {
    name: string,
    id: string,
    permissions: number
}

main.app.get("/users/list", async (req, res) => {
	let type = z.object({})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.params, req.headers, res)
	if (checked_params == undefined)
		return

    db_helper.get_users_from_db().then(l => res.send(l)).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/users/new", async (req, res) => {
	let type = z.object({
		login_hash: z.string(),
		display_name: z.string(),
		group_id: t.ZodExistingGroupID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    if (await db_helper.user_exists_in_db(checked_body.login_hash, checked_body.display_name, "")) {
        res.status(400).send("An user with this name exists already!")
        return
    }

    db_helper.add_user_to_db(checked_body.display_name, checked_body.login_hash, checked_body.group_id).then(() => {
            return res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/users/delete", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingUserID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    if (!(await db_helper.user_exists_in_db("", "", checked_body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.remove_user_from_db(checked_body.id).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/users/permedit", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingUserID,
		permissions: z.number().positive()
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    if (!(await db_helper.user_exists_in_db("", "", checked_body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.set_user_perm(checked_body.id, checked_body.permissions).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/users/edit", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingUserID,
		login_hash: z.string().optional(),
		display_name: z.string().optional(),
		group_id: z.string().optional()
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    if (!(await db_helper.user_exists_in_db("", "", checked_body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.edit_user(checked_body.id, checked_body.login_hash, checked_body.display_name, checked_body.group_id).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.get("/groups/list", async (req, res) => {
	let type = z.object({})

	let checked_params = await main.check_request<z.infer<typeof type>>(type, PERMS.ViewUsrs, req.params, req.headers, res)
	if (checked_params == undefined)
		return

    db_helper.get_groups_from_db().then(l => res.send(l)).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/groups/new", async (req, res) => {
	let type = z.object({
		name: z.string(),
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.add_group_to_db(checked_body.name).then(() => {
            return res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/groups/edit", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingGroupID,
		name: z.string(),
		permissions: z.number().positive()
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.edit_group(checked_body.id, checked_body.name, checked_body.permissions).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/groups/delete", async (req, res) => {
	let type = z.object({
		id: t.ZodExistingGroupID,
	})

	let checked_body = await main.check_request<z.infer<typeof type>>(type, PERMS.EditUsrs, req.body, req.headers, res)
	if (checked_body == undefined)
		return

    db_helper.remove_group_from_db(checked_body.id).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})
