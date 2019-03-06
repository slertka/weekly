'use strict';
const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  title: String,
  notes: String,
  complete: String,
  priority: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task };