const { Router } = require("express")

/**
 * 
 * @param {Router} router 
 */
module.exports = (router)=>{
    router.route("/messages/getAll").get(require('../controllers/messages').getAllRelatedMessages)
}