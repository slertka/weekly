'use strict';
const mongoose = require('mongoose');

const EventSchema = mongoose.Schema ({
  title: String,
  startTime: String,
  notes: String,
});

const CalSchema = mongoose.Schema ({ 
  0: [EventSchema],
  1: [EventSchema],
  2: [EventSchema],
  3: [EventSchema],
  4: [EventSchema],
  5: [EventSchema],
  6: [EventSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// CalSchema.methods.sortEvents = function() {
//   // Find start by date, sort array in descending start time use $sort
// };

var Event = mongoose.model('Event', EventSchema);
var Cal = mongoose.model('Cal', CalSchema);

module.exports = { Event, Cal };