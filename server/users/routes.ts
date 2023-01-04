import * as db_helper from "./db_helper"
import * as main from "../main"
import {PERMS} from "../permissions"

export interface User {
    display_name: String,
    login_hash: String,
    permissions: Number,
    id: String,
    group_id: String
}

export interface Group {
    name: String,
    id: String,
    permissions: Number
}

main.app.get("/users/list", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

    if (!(await main.check_request(type, PERMS.ViewUsrs, req.body, req.headers, res)))
        return
    db_helper.get_users_from_db().then(l => res.send(l)).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/users/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "login_hash": "string",
            "display_name": "string",
            "group_id": "string"
        },
        required: ["login_hash", "display_name", "group_id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return
    
    if (await db_helper.user_exists_in_db(req.body.login_hash, req.body.display_name, "")) {
        res.status(400).send("An user with this name exists already!")
        return
    }

    db_helper.add_user_to_db(req.body).then(() => {
            return res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
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

    db_helper.remove_user_from_db(req.body).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
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

    db_helper.set_user_perm(req.body).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/users/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "login_hash": "string",
            "display_name": "string",
            "group_id": "string"
        },
        required: ["id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return

    if (!(await db_helper.user_exists_in_db("", "", req.body.id))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.edit_user(req.body).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.get("/groups/list", async (req, res) => {
	var type: main.bodyType = {
		fields: {},
	}

    if (!(await main.check_request(type, PERMS.ViewUsrs, req.body, req.headers, res)))
        return
    db_helper.get_groups_from_db().then(l => res.send(l)).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/groups/new", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "name": "string",
        },
        required: ["name"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return

    db_helper.add_group_to_db(req.body).then(() => {
            return res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/groups/edit", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
            "name": "string",
            "permissions": "number"
        },
        required: ["id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return

    if (!(await db_helper.group_exists_in_db(req.body.id))) {
        res.status(400).send("A group with this id does not exist!")
        return
    }

    db_helper.edit_group(req.body).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})

main.app.post("/groups/delete", async (req, res) => {
	var type: main.bodyType = {
		fields: {
            "id": "string",
        },
        required: ["id"]
	}

    if (!(await main.check_request(type, PERMS.EditUsrs, req.body, req.headers, res)))
        return
    
    if (!(await db_helper.group_exists_in_db(req.body.id))) {
        res.status(400).send("A group with this id does not exist!")
        return
    }

    db_helper.remove_group_from_db(req.body).then(() => {
        res.status(200).send("Ok")
    }).catch(err => {
        res.status(500).send(err)
    })
})