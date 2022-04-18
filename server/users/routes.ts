import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"

export interface User {
    display_name: String,
    login_hash: String,
    permissions: Number,
    id: String
}

main.app.get("/users/list", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

    if (!(await main.check_request(type, PERMS.ViewUsrs, req.body, req.headers, res)))
        return
    db_helper.get_users_from_db().then(l => res.send(l))
})

main.app.post("/users/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "login_hash": "string",
            "display_name": "string"
        },
        required: ["login_hash", "display_name"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return
    
    if (await db_helper.user_exists_in_db(req.body.login_hash, req.body.display_name, "")) {
        res.status(400).send("An user with this name exists already!")
        return
    }

    db_helper.add_user_to_db(req.body, () => {
            return res.status(200).send("Ok")
    })
})

main.app.post("/users/delete", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
        },
        required: ["id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return
    
    if (!(await db_helper.user_exists_in_db("", "", req.body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.remove_user_from_db(req.body, () => {
            return res.status(200).send("Ok")
    })
})

main.app.post("/users/permedit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "permissions": "number"
        },
        required: ["id", "permissions"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return

    if (!(await db_helper.user_exists_in_db("", "", req.body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.set_user_perm(req.body, () => {
            return res.status(200).send("Ok")
    })
})

main.app.post("/users/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "login_hash": "string",
            "display_name": "string"
        },
        required: ["id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return

    if (!(await db_helper.user_exists_in_db("", "", req.body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.edit_user(req.body, () => {
        return res.status(200).send("Ok")
    })
})

main.app.post("/users/test", async (req, res) => {
    var user: main.bodyType = {
        fields: {
            "name": "string",
            "hash": "string"
        },
        required: ["name", "hash"]
    }
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "user": user,
            "display_name": "string"
        },
        required: ["id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return
    res.send("ok")
})