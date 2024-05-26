const {Pool} = require('pg')
require('dotenv').config()
const env = process.env

const pool = new Pool(
    {
        host : env.DBHOST,
        user : env.DBUSER,
        password :env.DBPASSWORD,
        database :env.DB,
        port: env.DBPORT
    }
)

module.exports = {pool}