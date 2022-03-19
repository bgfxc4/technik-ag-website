import axios from "axios"

const actions = {
	async getStorage({}, callback) {
        axios.get('get-storage').then(res => {
            callback(res)
        }).catch(err => {
            console.log(err)
            callback(undefined, err)
        })
    },
}

export default {
	actions
}