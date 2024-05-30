const router = require('express').Router()



module.exports = function (app){
    app.use("",router)
    require('./auth')(router)
    require('./jwt')(router)
    require('./designers')(router)
    require('./messages')(router)
}