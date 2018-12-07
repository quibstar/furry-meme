const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  done: Boolean,
  create: Date,
  updated: { type: Date, default: Date.now },
});

module.exports = listItemSchema;
