const { generator } = require("./crudGenerator");

const DiscussionsTable = {
    tableName: "discussions",
    columns: ["id", "client_id", "designer_id"]
};

module.exports = generator(DiscussionsTable);
