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
app.get('test',(req,res)=>{res.send("<html>bleh</html>")})
router(app)



const server = app.listen(port,'0.0.0.0',()=>{
    console.log(`running on port : ${port}`);
})
websocket(server)
