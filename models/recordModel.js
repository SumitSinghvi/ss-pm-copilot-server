const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  Name: {type: String, required: true},
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Archive: { type: Boolean, default: false }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
