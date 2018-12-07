const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  model: String,
  serialNumber: String,
  pricePerUnit: Number,
  category: String,
  quantity: Number,
  location: String,
  unitType: String,
  created: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('inventory', inventorySchema);

module.exports = ModelClass;
