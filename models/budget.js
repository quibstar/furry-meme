const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  category: String,
  amount: Number,
  payments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'payment',
    },
  ],
  create: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('budget', budgetSchema);

module.exports = ModelClass;
