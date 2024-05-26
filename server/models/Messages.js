const { generator } = require("./crudGenerator");

const MessagesTable = {
    tableName: "messages",
    columns: ["id", "content", "timestamp", "disc_id", "sender", "receiver", "status"]
};

module.exports = generator(MessagesTable);
