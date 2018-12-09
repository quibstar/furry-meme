const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: String,
  amount: Number,
  created: Date,
  updated: { type: Date, default: Date.now },
});

const Materials = new Schema({
  material: String,
  location: String,
  pricePerUnit: Number,
});

const AreaSchema = new Schema({
  useInProjectTotal: Boolean,
  unit: String,
  label: String,
  widths: [Number],
  heights: [Number],
  lengths: [Number],
  cost: [Materials],
  created: Date,
  updated: { type: Date, default: Date.now },
});

const ProductsSchema = new Schema({
  name: String,
  quantity: Number,
  unit: String,
  price: Number,
  total: Number,
});

const ProjectSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'account',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: String,
  items: [ItemSchema],
  areas: [AreaSchema],
  products: [ProductsSchema],
  create: Date,
  updated: { type: Date, default: Date.now },
});

const ModelClass = mongoose.model('project', ProjectSchema);

module.exports = ModelClass;
