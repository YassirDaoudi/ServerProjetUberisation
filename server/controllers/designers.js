const crud = require('../models/Designers')
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getAll = (req, res) => {
    //check if body isnt empty 

    //get function from model 
    let getAll = crud.getAll
    getAll().then(r => { res.json(r) })
}
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const insert = (req,res) =>{
    //check if body isnt empty 
    let body = req.body
    //get function from model 
    let insert = crud.insert
    insert([body.user_id,body.profile_pic,body.description]).then(r => { res.json({status: r}) })
}

module.exports = { getAll,insert }