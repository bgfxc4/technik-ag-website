import * as db_helper from "./db_helper"
import * as main from "../main"

export interface User {
    display_name: String,
    login_hash: String,
    permissions: Number
}

main.app.get("/users/list", (req, res) => {
    db_helper.get_users_from_db(l => res.send(l))
})

main.app.post("/users/new", async (req, res) => {
    if (!main.check_request(['login_hash', 'display_name'], false, req.body, req.headers, res))
        return
    
    if (await db_helper.user_exists_in_db(req.body.login_hash, req.body.display_name)) {
        res.status(400).send("An user with this name exists already!")
        return
    }

    db_helper.add_user_to_db(req.body, () => {
            return res.status(200).send("Ok")
    })
})

main.app.post("/users/delete", async (req, res) => {
    if (!main.check_request(['display_name'], false, req.body, req.headers, res))
        return
    
    if (!(await db_helper.user_exists_in_db("", req.body.display_name))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.remove_user_from_db(req.body, () => {
            return res.status(200).send("Ok")
    })
})

main.app.post("/users/permedit", async (req, res) => {
    if (!main.check_request(['display_name', 'permissions'], false, req.body, req.headers, res))
        return
    
    if (isNaN(req.body.permissions))

    if (!(await db_helper.user_exists_in_db("", req.body.display_name))) {
        res.status(400).send("An user with this name does not exist!")
        return
    }

    db_helper.set_user_perm(req.body, () => {
            return res.status(200).send("Ok")
    })
})