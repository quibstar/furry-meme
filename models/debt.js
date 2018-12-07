const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Payments = require('./payment');
const debtSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  amount: { type: Number, default: 0.0 },
  accountNumber: String,
  category: String,
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'payment',
    },
  ],
  create: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('debt', debtSchema);

module.exports = ModelClass;
