const { pool } = require("../models/pg")
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const update =async function update(req,res) {
    let client = await pool.connect()
    try{
        await client.query("Begin;")
    for (let index = 0; index < req.body.tasks.length; index++) {
        const task = req.body.tasks[index];
        await client.query("update tasks set status ='done' where id =$1;",[task.id])
    }
    let count =  (await client.query("SELECT COUNT(*) AS task_count FROM tasks WHERE project_id = $1;",[req.body.project])).rows[0].task_count
    count = ((req.body.tasks.length)/count)*100
    await client.query("update projects set progress =$1 where id=$2",[Math.round(count),req.body.project])


    await client.query("commit;")
    res.json({status:true})}
    catch(err){
        console.log(err);
        await client.query("rollback;")
        res.json({status:false})
    }finally{
        client.release();
    }
}
module.exports ={update}