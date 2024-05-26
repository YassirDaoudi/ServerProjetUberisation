const { generator } = require("./crudGenerator");

const ClientsTable = {
    tableName: "clients",
    columns: ["user_id", "profile_pic"]
};

module.exports = generator(ClientsTable);
