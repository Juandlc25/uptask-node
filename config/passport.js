const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Users = require("../models/Users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({
          where: { email, active: 1 },
        });
        if (!user.verifiedPassword(password)) {
          return done(null, false, { message: "Wrong password" });
        }
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: "Account does not exist" });
      }
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

module.exports = passport;
