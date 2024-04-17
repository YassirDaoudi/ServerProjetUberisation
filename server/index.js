const express = require('express')
const app = express()
const bodyParser = require('body-parser').json()
const cors = require('cors')()
const router = require('./routes')
require('dotenv').config()
const port = process.env.PORT

app.use(cors)
app.use(bodyParser)
router(app)



app.listen(port,()=>{
    console.log(`running on port : ${port}`);
})