const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taksSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  category: String,
  dueDate: Date,
  time: String,
  assignedTo: [],
  repeating: false,
  create: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('task', taksSchema);

module.exports = ModelClass;
