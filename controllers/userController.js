const Users = require("../models/Users");
const sendEmail = require("../handler/email");

exports.signUp = (req, res, next) => {
  res.render("signUp", { name: "Create an account" });
};

exports.signIn = (req, res, next) => {
  const { error } = res.locals.messages;
  res.render("signIn", { name: "Log in", error });
};

exports.createAccount = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    await Users.create({ email, password });
    const confirmUrl = `http://${req.headers.host}/confirm/${email}`;

    // crear el objeto de usuario
    const user = {
      email,
    };

    // enviar email
    await sendEmail.send({
      user,
      subject: "Confirm your UpTask account",
      confirmUrl,
      file: "confirm-account",
    });

    // redirigir al usuario
    req.flash("correcto", "We send an email, confirm your account");

    res.redirect("/sign-in");
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("signUp", {
      email,
      password,
      name: "Create an account",
      messages: req.flash(),
    });
  }
};

exports.reset = (req, res, next) => {
  res.render("reset", { name: "Reset password" });
};

exports.confirmAccount = async (req, res) => {
  const email = req.params.email;
  const user = await Users.findOne({
    where: {
      email,
    },
  });

  // si no existe el usuario
  if (!user) {
    req.flash("error", "Invalid");
    res.redirect("/sign-up");
  }

  user.active = 1;
  await user.save();

  req.flash("correcto", "Account activated successfully");
  res.redirect("/sign-in");
};
