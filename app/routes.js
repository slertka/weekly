const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');

const router = express.Router();

const { User } = require('./models/user');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Sign up Page
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/signup.html"));
})

// Create new user
router.post('/signup', (req, res) => {
  const requiredFields = ['username', 'password', 'password2'];

  // Verify username and password are strings
  const nonStringField = requiredFields.find(field => field in req.body && typeof req.body[field] !== 'string');
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  };

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
  const fieldTooSmall = Object.keys(requiredLengths).find(field => 'min' in requiredLengths[field] && req.body[field].trim().length < requiredLengths[field].min);
  const fieldTooLarge = Object.keys(requiredLengths).find(field => 'max' in requiredLengths[field] && req.body[field].trim().length > requiredLengths[field].max);

  if (fieldTooSmall || fieldTooLarge) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: fieldTooSmall 
                ? `Must be at least ${requiredLengths[fieldTooSmall].min} character(s) long` 
                : `Must be less than ${requiredLengths[fieldTooLarge].max} characters long`,
      location: fieldTooSmall || fieldTooLarge 
    })
  }

  // Verify username and password are trimmed (no whitespace)
  const explTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explTrimmedFields.find(field => req.body[field] !== req.body[field].trim());
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    })
  };

  // Verify passwords match
  if (req.body.password !== req.body.password2) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Passwords do not match',
      location: 'password'
    })
  };

  // Create new user
  const { username, password } = req.body;
  return User.find({username})
    .countDocuments()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already exists',
          location: 'username'
        })
      }
    return User.hashPassword(password);
  }).then(hash => {
    return User.create({
      username,
      password: hash
    });
  }).then(user => {
    return res.status(201).json(user.serialize());
  }).catch(err => {
    if (err.reason == 'ValidationError') {
      return res.status(err.code).json(err);
    }
    return res.status(500).json({message: 'Internal Server Error'})
  })

})

// Log in Page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "/views/login.html"))
})

// Authenticate registered user
const localAuth = passport.authenticate('local', {
  session: false
  // successRedirect: '/planner',
});
const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  })
}
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.send({ authToken });
});

// Access Protected Page - Planner
const jwtStrat = passport.authenticate('jwt', {session: false});
router.get('/planner', jwtStrat, (req, res) => {
  // respond with data from the user of events and calendars
  res.send({ message: 'this will be a json response with user data'})
});

// Logout
router.get('/logout', (req, res) => {
  console.log(req);
  req.logout();
  res.redirect('/');
})

module.exports = { router };