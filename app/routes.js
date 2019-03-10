const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');
const Storage = require('dom-storage');

const router = express.Router();
var localStorage = new Storage('./jwt.json', { strict: false, ws: ' ' });

const { User } = require('./models/user');
const { Cal } = require('./models/calendar');
const { Task } = require('./models/task')
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
  session: false,
  failureRedirect: '/login'
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
  localStorage.setItem('myKey', authToken );
  res.status(201).end();
});

// Display planner page
router.get('/planner', (req, res) => {
  // load static file
  res.sendFile(path.join(__dirname, '/views/planner.html'))
});

// JSON Web Token Strategy
const jwtStrat = passport.authenticate('jwt', {session: false});

// Access Protected Data - Planner Events
router.get('/planner/events', jwtStrat, (req, res) => {
  const { _id } = req.user;

  // Find planner associated with user
  Cal.find({ user: _id })
    .then(cal => {
      res.send({ cal });
    })
})

/// Access Protected Data - Planner Tasks
router.get('/planner/tasks', jwtStrat, (req, res) => {
  const { _id } = req.user

  // Find tasks associated with user
  Task.find({ user: _id })
    .then(tasks => res.json({ tasks }))
})

// Create new event
router.post('/planner/events', jwtStrat, (req, res) => {
  const { _id } = req.user;
  const { title, notes, startTime, day } = req.body;
  
  return Cal.find({ user: _id })
    .then(cal => { 
      return cal[0]})
    .then(cal => {
      cal[day].push({ title, notes, startTime });
      return cal.save();
    })
    .then(() => {
      return res.status(201).end()
    })
    .catch(err=>console.log(err));

})

// Update existing event
router.put('/planner/events', jwtStrat, (req, res) => {

})

// Delete existing event
router.delete('/planner/events', jwtStrat, (req, res) => {

})

// Create new task
router.post('/planner/tasks', jwtStrat, (req, res) => {
  const { _id } = req.user;
  const { title, notes, complete, priority } = req.body;

  Task.create({
    title,
    notes,
    priority,
    user: _id
  }).then(task => res.status(201).json({task}))
})

// Update existing task
router.put('/planner/tasks', jwtStrat, (req, res) => {
})

// Delete existing task
router.delete('/planner/tasks', jwtStrat, (req, res) => {
  const { _id } = req.body;
  return Task.deleteOne({ _id }).then(() => res.status(204).end())
})

// Logout
router.get('/logout', (req, res) => {
  console.log(req);
  req.logout();
  res.redirect('/');
})

module.exports = { router };