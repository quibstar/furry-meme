const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ListItems = require('./listItem');
const listSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  listItems: [ListItems],
  created: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('list', listSchema);

module.exports = ModelClass;
