import * as db_helper from "./db_helper"
import * as main from "../main"

export interface user {
    name: String,
    login_hash: String,
    permissions: Number
}

main.app.get("/users/list", (req, res) => {
    db_helper.get_users_from_db(l => res.send(l))
})