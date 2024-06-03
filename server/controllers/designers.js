const crud = require('../models/Designers')
const { pool } = require('../models/pg')
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getAll = (req, res) => {
    //check if body isnt empty 

    //get function from model 
    let getAll = crud.getAll
    pool.query("SELECT *    FROM users    JOIN designers ON users.id = designers.user_id;")
        .then(r => {
            r.rows.forEach((u) => {u.password = '' })
            res.json(r.rows)
        })
}
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const insert = (req, res) => {
    //check if body isnt empty 
    let body = req.body
    //get function from model 
    let insert = crud.insert
    insert([body.user_id, body.profile_pic, body.description]).then(r => { res.json({ status: r }) })
}
const getbydiscid = (req,res)=>{
    const getfromdb = ()=>{
        let sql = "select * from "
    }
}

module.exports = { getAll, insert }