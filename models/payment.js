const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentsSchema = new Schema({
  name: {
    type: String,
  },
  debtId: {
    type: Schema.Types.ObjectId,
    ref: 'debt',
  },
  budgetId: {
    type: Schema.Types.ObjectId,
    ref: 'budget',
  },
  note: String,
  amount: { type: Number, default: 0.0, requires: [true, 'Amount is required.'] },
  paidOn: Date,
  category: String,
  create: Date,
  updated: { type: Date, default: Date.now },
});

// module.exports = paymentsSchema;
paymentsSchema.index({ debtId: 1, budgetId: 1 });

const ModelClass = mongoose.model('payment', paymentsSchema);

module.exports = ModelClass;
