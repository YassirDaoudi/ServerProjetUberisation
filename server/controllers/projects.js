const crud = require('../models/Projects')
const { pool } = require('../models/pg')
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getAll = (req, res) => {
    //check if body isnt empty 

    //get function from model 
    let getAllby = crud.getAllBy
    
    getAllby(undefined,req.body.decodedjwt.usertype,req.body.decodedjwt.id)
    .then(async (r) => {
        for (let index = 0; index < r.length; index++) {
            const project = r[index];
            let tasks = await pool.query("select * from tasks where project_id = $1",[project.id])
            project.tasks = tasks.rows
        }
        
        res.json({projects:r}) 
    })
}
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const insert = async (req,res) =>{
    //check if body isnt empty 
    console.log(req.body);
    //check authorization
    let body = req.body
    let user = req.body.decodedjwt

    //get function from model 
    const client = await pool.connect();
    try {
    await client.query('BEGIN');
    let r  = await client.query("insert into projects(name,progress,client,designer,description,final_product) values ($1,$2,$3,$4,$5,$6) returning id ",[body.name,0,user.id,body.designer,body.description,null])
    
    for (let i =0 ; i<body.tasks.length ;i++) {
        let task = body.tasks[i]
        console.log("task");
        console.log(task);
        await client.query("insert into tasks (name,description,status,project_id,price) values($1,$2,$3,$4,$5)",[task.name,task.description,"pending",r.rows[0].id,task.price])
    };
    
    await client.query('COMMIT'); // Commit the transaction
    res.json({status: true})
  } catch (error) {
    console.log(error);
    await client.query('ROLLBACK'); // Roll back the transaction in case of an error
    res.json({status:false} )// Re-throw the error to be handled by the caller
  } finally {
    client.release(); // Release the client back to the pool
  }

}

module.exports = { getAll,insert }