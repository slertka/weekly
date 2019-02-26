'use strict';
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const TaskSchema = Schema({
  title: String,
  notes: String,
  complete: Boolean,
  priority: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var Task = mongoose.Schema('Task', TaskSchema);

module.exports = { Task };