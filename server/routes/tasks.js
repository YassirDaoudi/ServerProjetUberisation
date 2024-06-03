const { Router } = require("express")

/**
 * 
 * @param {Router} router 
 */
module.exports = function (router) {
    router.route("/tasks/update").post(require('../controllers/tasks').update)
}