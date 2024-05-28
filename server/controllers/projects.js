const crud = require('../models/Projects')
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

    //check authorization
    let body = req.body
    let user = req.decodedjwt

    //get function from model 
    let insert = crud.insert
    insert([body.name,0,user.id,body.designer,body.description,null]).then(r => { res.json({status: r}) })
}

module.exports = { getAll,insert }