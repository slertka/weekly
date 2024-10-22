"use strict";

// Dependencies
require("dotenv").config();

// Passport Strategies
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

// Model
const { User } = require("../models/user");

const localStrategy = new LocalStrategy((username, password, callback) => {
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        return Promise.reject({
          reason: "LoginError",
          message: "Invalid username or password"
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: "LoginError",
          message: "Invalid username or password"
        });
      }
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason == "LoginError") {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ["HS256"]
  },
  (payload, done) => {
    return done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
