'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String
})

const User = mongoose.model('User', UserSchema);

module.exports = { User };