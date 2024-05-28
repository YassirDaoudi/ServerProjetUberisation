const { Router } = require("express")

module.exports = (router )=>{
    router.route('/designers/getAll').get(require('../controllers/designers').getAll)
    router.route('/designers/insert').post(require('../controllers/designers').insert)
}