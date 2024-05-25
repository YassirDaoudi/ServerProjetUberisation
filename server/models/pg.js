const {Pool} = require('pg')
const env = process.env

console.log(env.PORT);
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