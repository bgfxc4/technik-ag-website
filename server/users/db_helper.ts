import * as main from "../main"
import * as storage from "./routes"

export function get_users_from_db(callback: (res: any) => void, with_login_hash=false) {
    var projection = with_login_hash ? {} : {login_hash: 0}
	main.db.collection("users").find().project(projection).toArray((err, data) => {
		if (err)
			throw err
		callback(data)
	})
}