const passport = require("passport");

exports.user = passport.authenticate("user", { session: false });
exports.admin = passport.authenticate("admin", { session: false });
exports.learner = passport.authenticate("learner", { session: false });
exports.creator = passport.authenticate("creator", { session: false });
exports.affiliator = passport.authenticate("affiliator", { session: false });
exports.all = passport.authenticate(["affiliator","user","learner","creator","admin"], { session: false });
