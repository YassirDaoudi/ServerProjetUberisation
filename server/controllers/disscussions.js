const { pool } = require("../models/pg")

const createDiscussion = (req, res) => {
    console.log(req.body);
    const checkIfexists = () => {
        let sql = "select * from discussions where (client_id=$1 and designer_id=$2) or (client_id = $2 and designer_id = $1) "
        return pool.query(sql, [req.body.decodedjwt.id, req.body.receiver])
    }
    /**
     * 
     * @param {import("pg").QueryResult} result 
     * @returns 
     */
    const getFromDb = (result) => {

        if (result.rowCount > 0) {
            res.json(result.rows[0])
            return new Promise((resolve, reject) => {
                resolve(1)
            })
        } else {
            console.log("shouldnt be here");
            let sql = "INSERT INTO discussions (client_id, designer_id) VALUES ($1, $2) RETURNING id, client_id, designer_id;;"
            let client;
            let designer;
            if (req.body.decodedjwt.usertype == "client") {
                client = req.body.decodedjwt.id
                designer = req.body.receiver
            } else {
                client = req.body.receiver
                designer = req.body.decodedjwt.id
            }
            return pool.query(sql, [client, designer])
        }
    }
    /**
     * 
     * @param {import("pg").QueryResult} response 
     */
    const send = (response) => {
        if (response == 1) return;
        else res.json(response.rows[0]);
    }
    checkIfexists()
    .then(getFromDb)
    .then(send)
}

module.exports = { createDiscussion }