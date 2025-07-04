const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
  log: [Date] // stores check-off dates
});

module.exports = mongoose.model('Habit', habitSchema);
