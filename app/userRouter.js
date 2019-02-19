const express = require('express');
const router = express.Router();

const { User } = require('./models/user');

router.use(express.json());

router.post('/', (req, res) => {
  const requiredFields = ['username', 'password'];
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

  // Verify password meets min / max character requirements
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
    })
  }).then(user => {
    return res.status(201).json(user.serialize());
  }).catch(err => {
    console.log(err);
  })

})

module.exports = { router };