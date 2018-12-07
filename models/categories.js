const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  categories: [String],
});

module.exports = categorySchema;
