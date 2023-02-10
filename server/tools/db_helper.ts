import * as main from "../main"
import { Checklist } from "./routes"

export async function get_checklists_from_db(): Promise<Checklist[]> {
    const query = `SELECT cl.name, cl.id, 
    COALESCE(json_agg((SELECT x FROM (SELECT ci.id, ci.name, ci.checked) AS x)) FILTER (WHERE ci.id IS NOT NULL), '[]') AS items
    FROM checklist_list AS cl
 LEFT JOIN checklist_items AS ci ON cl.id = ci.list_Id
 GROUP BY cl.id`
    return main.db_pool.query(query).then(res => res.rows).catch(err => {
        throw err
    })
}

export async function add_checklist_to_db(name: string, items: string[]): Promise<void> {

    return main.db_pool.query(`INSERT INTO checklist_list (name) VALUES ($1) RETURNING id`, [name]).then(res => {
        if (items.length == 0)
            return
        let values = items.map(el => `(${res.rows[0].id}, ${el}, FALSE),`).join(" ").slice(0, -1)
        return main.db_pool.query(`INSERT INTO checklist_items (list_id, name, checked) VALUES $1`, [values]).then(_ => {return}).catch(err => {
            throw err
        })
    }).catch(err => {
        throw err
    })
}

export async function add_items_to_checklist(list_id: number, names: string[]): Promise<void> {
    if (names.length == 0)
        return
    let values = names.map((el, idx) => `($1, $${idx+2}, FALSE),`).join(" ").slice(0, -1)
    console.log(values)
    return main.db_pool.query(`INSERT INTO checklist_items (list_id, name, checked) VALUES ${values}`, [list_id, ...names]).then(_ => {return}).catch(err => {
        throw err
    })
}

export async function set_items_checked(list_id: number, item_ids: number[], checked_list: boolean[]): Promise<void> {
    let query = "UPDATE checklist_items SET checked = (CASE " 
        + item_ids.map((_, idx) => `WHEN id = $${idx+1} THEN ${checked_list[idx] ? "TRUE" : "FALSE"}`).join(" ") + ` END) WHERE list_id = $${item_ids.length+1} AND id = ANY($${item_ids.length+2}::int[])`
    
        return main.db_pool.query(query, [...item_ids, list_id, item_ids]).then(() => {return}).catch(err => {
        throw err
    })
}

export async function delete_checklist(list_id: number): Promise<void> {
    return main.db_pool.query("DELETE FROM checklist_list WHERE id = $1", [list_id]).then(() => {return}).catch(err => {
        throw err
    })
}

export async function delete_items_from_checklist(list_id: number, item_ids: number[]): Promise<void> {
    return main.db_pool.query(`DELETE FROM checklist_items WHERE id IN (${item_ids.map((_, idx) => `$${idx+2}`).join(", ")}) AND list_id = $1`, [list_id, ...item_ids]).then(() => {return}).catch(err => {
        throw err
    })
}
