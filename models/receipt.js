const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReceiptSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  amount: Number,
  business: String,
  purchaseDate: Date,
  category: String,
  create: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('receipt', ReceiptSchema);

module.exports = ModelClass;
