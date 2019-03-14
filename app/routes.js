const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const path = require('path');
const bodyParser = require('body-parser');

const router = express.Router();

const { User } = require('./models/user');
const { Cal } = require('./models/calendar');
const { Task } = require('./models/task')
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

// Authenticate registered user
const localAuth = passport.authenticate('local', {
  session: false
});
const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  })
}
router.post('/login', localAuth, (req, res) => {
  let authToken = createAuthToken(req.user.serialize());
  let username = req.user.username;
  res.json({authToken, username});
});

// JSON Web Token Strategy
const jwtStrat = passport.authenticate('jwt', {session: false});

// Access Protected Data - Planner Events
router.get('/planner/events', jwtStrat, (req, res) => {
  const { _id } = req.user;

  // Find planner associated with user
  Cal.find({ user: _id })
    .then(cal => {
      res.json({ cal });
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
router.put('/planner/events/:id', jwtStrat, (req, res) => {
  const user = req.user;
  const requestBody = req.body;

  let eventId = requestBody._id
  let { day, title, notes, startTime } = requestBody;

  // Verify param id and body id match
  if (!(req.params.id && eventId && req.params.id === eventId)) {
    return res.status(400).json({
      error: 'Request path id and body _id must match'
    })
  };

  // Determine fields to update
  const update = {};
  const updateableFields = ['title', 'notes', 'startTime'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      let updateKey = day + '.$.' + field;
      update[updateKey] = req.body[field];
    }
  });

  // Create query document object for mongo
  const eventIdQ = day + '._id';
  let query = {} ;
  query[eventIdQ] = eventId;

  // Update event
  return Cal.updateOne(
    query,
    { $set: update },
    { returnNewDocument: true}
  ).then(event => {
    console.log(event);
    res.status(204).end();
  })

})

// Delete existing event
router.delete('/planner/events/:id', jwtStrat, (req, res) => {

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
router.put('/planner/tasks/:id', jwtStrat, (req, res) => {
  const { _id } = req.body;
  const { title, notes, complete, priority } = req.body

  // Verify param id and body id match
  if (!(req.params.id && _id && req.params.id === _id)) {
    return res.status(400).json({
      error: 'Request path id and body _id must match'
    })
  }

  // Determine fields to update
  const update = {};
  const updateableFields = ['title', 'notes', 'complete', 'priority'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      update[field] = req.body[field];
    }
  })

  // Update tasks
  return Task.findByIdAndUpdate( _id , 
    { $set: update },
    { new: true }
  ).then(updatedTask => {
    res.status(204).json( updatedTask );
  })
})

// Delete existing task
router.delete('/planner/tasks/:id', jwtStrat, (req, res) => {
  return Task.findByIdAndDelete(req.params.id).then(() => res.status(204).end());
})

// Logout
router.get('/logout', (req, res) => {
  console.log(req);
  req.logout();
  res.redirect('/');
})

module.exports = { router };