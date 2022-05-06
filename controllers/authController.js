const passport = require("passport");
const Users = require("../models/Users");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
const sendEmail = require("../handler/email");

const Op = Sequelize.Op;

exports.authUser = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in",
  failureFlash: true,
  badRequestMessage: "Both fields are required",
});

exports.authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("sign-in");
};

exports.logOut = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/sign-in");
  });
};

exports.sendToken = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    req.flash("error", "That account does not exist");
    res.redirect("/reset");
  }

  user.token = crypto.randomBytes(20).toString("hex");
  user.expiration = Date.now() + 3600000;

  await user.save();

  const resetUrl = `http://${req.headers.host}/reset/${user.token}`;

  await sendEmail.send({
    user,
    subject: "Password reset",
    resetUrl,
    file: "reset-password",
  });

  req.flash("correcto", "A message was sent to your email");
  res.redirect("/sign-in");
};

exports.validToken = async (req, res) => {
  const { token } = req.params;
  const user = await Users.findOne({ where: { token } });
  if (!user) {
    req.flash("error", "No valid");
    res.redirect("/reset");
  }
  res.render("resetPassword", {
    name: "Reset Password",
  });
};

exports.updatePassword = async (req, res) => {
  const { token } = req.params;
  const user = await Users.findOne({
    where: {
      token,
      expiration: {
        [Op.gte]: Date.now(),
      },
    },
  });

  if (!user) {
    req.flash("error", "No valid");
    res.redirect("/reset");
  }

  user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  user.token = null;
  user.expiration = null;

  await user.save();

  req.flash("correcto", "The password has been changed successfully");
  res.redirect("/sign-in");
};
