const { generator } = require("./crudGenerator")

const UsersTable = {
    tableName : "users",
    columns  : ["id","fullname","email","password","usertype"]
}
module.exports = generator(UsersTable)