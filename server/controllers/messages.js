const { pool } = require("../models/pg")

const getAllRelatedMessages = (req,res)=>{
    const getfromdb =()=>{
        let sql= "select * from messages where sender=$1 or receiver=$1 "
        return pool.query(sql,[req.body.decodedjwt.id])
    }
    /**
     * 
     * @param {import("pg").QueryResult} response 
     */
    const send =(response)=>{
        const messages = response.rows.map((message)=>{
            try {
                let pr = JSON.parse(message.content)
                message.projectRequest = pr
                return message
            } catch (error) {
                return message
            }
        })
        if (response.rowCount >0) res.json(messages);
        else res.json([])

    }
    getfromdb()
    .then(send)
}
module.exports ={getAllRelatedMessages}
