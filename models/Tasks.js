const Sequelize = require("sequelize");
const db = require("../config/db");
const Projects = require("./Projects");

const Tasks = db.define("tasks", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  task: Sequelize.STRING(100),
  state: Sequelize.INTEGER(1),
});
Tasks.belongsTo(Projects);

module.exports = Tasks;
