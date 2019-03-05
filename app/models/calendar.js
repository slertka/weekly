'use strict';
const mongoose = require('mongoose');
const { User } = require('./user');

var Schema = mongoose.Schema;

const EventSchema = Schema ({
  title: String,
  startTime: Date,
  notes: String,
});

const CalSchema = Schema ({ 
  0: [EventSchema],
  1: [EventSchema],
  2: [EventSchema],
  3: [EventSchema],
  4: [EventSchema],
  5: [EventSchema],
  6: [EventSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

CalSchema.pre('find', function(next) {
  this.populate('user');
});

CalSchema.methods.sortEvents = function() {
  // Find start by date, sort array in descending start time
};

var Event = mongoose.model('Event', EventSchema);
var Cal = mongoose.model('Cal', CalSchema);

module.exports = { Event, Cal };