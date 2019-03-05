'use strict';
const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
  title: String,
  notes: String,
  complete: Boolean,
  priority: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task };