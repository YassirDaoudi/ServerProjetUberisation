const express = require('express')
const app = express()
const bodyParser = require('body-parser').json()
const cors = require('cors')()
require('dotenv').config()
const router = require('./routes')
const websocket = require('./websocket')
const port = process.env.PORT


app.use(cors)
app.use(bodyParser)
router(app)



const server = app.listen(port,()=>{
    console.log(`running on port : ${port}`);
})
websocket(server)