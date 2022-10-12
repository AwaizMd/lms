const { passportAuthJwt } = require("../helpers/passportAuthHelper");
const passport = require("passport");
const AnonymousStrategy = require("passport-anonymous").Strategy;

module.exports = {
  initialize: () => {
    passportAuthJwt(require("../models/Users/users.model"), "admin");
    passportAuthJwt(require("../models/Users/users.model"), "user");
    passportAuthJwt(require("../models/Users/users.model"), "learner");
    passportAuthJwt(require("../models/Users/users.model"), "creator");
    passportAuthJwt(require("../models/Users/users.model"), "affiliator");

    passport.use(new AnonymousStrategy());
  },
};
