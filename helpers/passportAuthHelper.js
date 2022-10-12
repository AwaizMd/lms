const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwt: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: require("../config/env").jwt.key,
    passReqToCallback: true,
  },
};

exports.passportAuthJwt = (Model, authName) => {
  passport.use(
    authName,
    new JwtStrategy(opts.jwt, (req, jwt_payload, done) => {
      const opts = {
        where: { id: jwt_payload.id },
      };
      if (authName === "user") {
        opts.where.status = true;
      }

      if (authName === "admin") {
        opts.where.status = true;
        opts.where.userTypeId = 1;
      }

      if (authName === "learner") {
        opts.where.status = true;
        opts.where.userTypeId = 2;
      }

      if (authName === "creator") {
        opts.where.status = true;
        opts.where.userTypeId = 3;
      }

      if (authName === "affiliator") {
        opts.where.status = true;
        opts.where.userTypeId = 3;
      }

      Model.findOne(opts)
        .then((u) => {
          if (u) {
            req[authName] = u;
            req[`is${authName}`] = true;
            done(null, u);
          } else {
            done(null, false);
          }
        })
        .catch((err) => {
          done(err, false);
        });
    })
  );
};
