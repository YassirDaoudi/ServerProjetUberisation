const { Router } = require('express')

module.exports = function (router) {
    router.use('/',require('../controllers/jwtCheck').jwtCheck)
}