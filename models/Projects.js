const Sequelize = require("sequelize");
const db = require("../config/db");
const slug = require("slug");
const shortid = require("shortid");

const Projects = db.define(
  "projects",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    url: Sequelize.STRING(100),
  },
  {
    hooks: {
      beforeCreate(project) {
        const url = slug(project.name).toLocaleLowerCase();
        project.url = `${url}-${shortid.generate()}`;
      },
    },
  }
);

module.exports = Projects;
