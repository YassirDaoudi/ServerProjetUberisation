const { generator } = require("./crudGenerator");

const projectsTable = {
    tableName: "projects",
    columns: ["name", "progress", "client","designer","description","final_product"]
};

module.exports = generator(projectsTable);