const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Categories = require('./categories');

const accountSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Name is required'],
  },
  created: Date,
  updated: { type: Date, default: Date.now },
  categories: [Categories],
});

const ModelClass = mongoose.model('account', accountSchema);

module.exports = ModelClass;
