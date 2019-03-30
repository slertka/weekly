const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sortArray = require("sort-array");

const router = express.Router();

const { User } = require("./models/user");
const { Cal } = require("./models/calendar");
const { Task } = require("./models/task");
const { JWT_SECRET, JWT_EXPIRY } = require("../config");
const { localStrategy, jwtStrategy } = require("./controllers/auth");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

passport.use(localStrategy);
passport.use(jwtStrategy);

// Create new user
router.post("/signup", (req, res) => {
  // const { username, password, password2 } = req.body;

  const requiredFields = ["username", "password", "password2"];
  // Verify username and password are strings
  const nonStringField = requiredFields.find(
    field => field in req.body && typeof req.body[field] !== "string"
  );
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Incorrect field type: expected string",
      location: nonStringField
    });
  }

  // Verify username and password meets min / max character requirements
  const requiredLengths = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const fieldTooSmall = Object.keys(requiredLengths).find(
    field =>
      "min" in requiredLengths[field] &&
      req.body[field].trim().length < requiredLengths[field].min
  );
  const fieldTooLarge = Object.keys(requiredLengths).find(
    field =>
      "max" in requiredLengths[field] &&
      req.body[field].trim().length > requiredLengths[field].max
  );

  if (fieldTooSmall || fieldTooLarge) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: fieldTooSmall
        ? `Must be at least ${
            requiredLengths[fieldTooSmall].min
          } character(s) long`
        : `Must be less than ${
            requiredLengths[fieldTooLarge].max
          } characters long`,
      location: fieldTooSmall || fieldTooLarge
    });
  }

  // Verify username and password are trimmed (no whitespace)
  const explTrimmedFields = ["username", "password"];
  const nonTrimmedField = explTrimmedFields.find(
    field => req.body[field] !== req.body[field].trim()
  );
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Cannot start or end with whitespace",
      location: nonTrimmedField
    });
  }

  // Verify passwords match
  if (req.body.password !== req.body.password2) {
    return res.status(422).json({
      code: 422,
      reason: "ValidationError",
      message: "Passwords do not match",
      location: "password"
    });
  }

  // Create new user
  const { username, password } = req.body;
  return User.find({ username })
    .countDocuments()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: "ValidationError",
          message: "Username already exists",
          location: "username"
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash
      });
    })
    .then(user => {
      Cal.create({
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        user: user._id
      });

      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason == "ValidationError") {
        return res.status(err.code).json(err);
      }
      return res.status(500).json({ message: "Internal Server Error" });
    });
});

// JSON Web Token Strategy
const jwtStrat = passport.authenticate("jwt", { session: false });

// Authenticate registered user
const localAuth = passport.authenticate("local", {
  session: false
});
const createAuthToken = function(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: "HS256"
  });
};

// Login user
router.post("/login", localAuth, (req, res) => {
  let authToken = createAuthToken(req.user.serialize());
  let username = req.user.username;
  res.json({ authToken, username });
});

// Create new task
router.post("/planner/tasks", jwtStrat, (req, res) => {
  const { _id } = req.user;
  const { title, notes, priority } = req.body;

  Task.create({
    title,
    notes,
    priority,
    complete: "off",
    user: _id
  }).then(task => res.status(201).json({ task }));
});

// Logout
router.get("/logout", (req, res) => {
  console.log(req);
  req.logout();
  res.redirect("/");
});

module.exports = { router };
