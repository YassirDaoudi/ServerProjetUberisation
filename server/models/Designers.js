const { generator } = require("./crudGenerator");

const DesignersTable = {
    tableName: "designers",
    columns: ["user_id", "profile_pic", "description"]
};

module.exports = generator(DesignersTable);
