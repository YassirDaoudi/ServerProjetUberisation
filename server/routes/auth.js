const { Router } = require("express");

module.exports=function (router) { 
    router.route("/auth/login").post(require('../controllers/auth').login)
    router.route("/auth/register").post(require('../controllers/auth').register)
 }