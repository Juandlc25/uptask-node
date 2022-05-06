const Sequelize = require("sequelize");
const db = require("../config/db");
const Projects = require("./Projects");
const bcrypt = require("bcrypt-nodejs");

const Users = db.define(
  "users",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Add a valid email",
        },
        notEmpty: {
          msg: "The email cannot be empty",
        },
      },
      unique: { args: true, msg: "User already registered" },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "The password cannot be empty",
        },
      },
    },
    active: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
    },
  }
);

Users.prototype.verifiedPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

Users.hasMany(Projects);

module.exports = Users;
