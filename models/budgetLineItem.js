const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  debtId: {
    type: Schema.Types.ObjectId,
    ref: 'debt',
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'payment',
  },
  amount: { type: Number, default: 0.0 },
  paid: Boolean,
  create: Date,
  category: String,
  updated: { type: Date, default: Date.now },
});

module.exports = budgetItemSchema;
