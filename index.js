const express = require("express");
const routes = require("./routes");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const helpers = require("./helpers");
require("dotenv").config({ path: ".env" });

const db = require("./config/db");

require("./models/Projects");
require("./models/Tasks");
require("./models/Users");

db.sync()
  .then(() => console.log("Server up and running"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.static("public"));

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.set("views", path.join(__dirname, "./views"));

app.use(flash());

app.use(cookieParser());

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.messages = req.flash();
  res.locals.user = { ...req.user } || null;
  next();
});

app.use("/", routes());

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log("Server up and running");
});
