'use strict';
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const eventSchema = Schema ({
  title: String,
  startTime: Date,
  endTime: Date,
  notes: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

const CalSchema = Schema ({ 
  0: [eventSchema],
  1: [eventSchema],
  2: [eventSchema],
  3: [eventSchema],
  4: [eventSchema],
  5: [eventSchema],
  6: [eventSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var Event = mongoose.Schema('Event', eventSchema);
var Cal = mongoose.Schema('Cal', CalSchema);

module.exports = { Event, Cal };