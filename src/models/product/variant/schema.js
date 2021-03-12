const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductVariantSchema = new Schema({
  store_hash: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sale_price: {
    type: Number,
  },
  on_sale: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  images: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductVariantImage'
  }],
  sort_order: {
    type: Number,
    default: 0
  },
  sku: {
    type: String
  },
  product_id: {
    type: String,
    required: true
  },
  option_values: [
    {
      _id: false,
      id: {
        type: String
      },
      label: {
        type: String
      },
      option_id: {
        type: String
      },
      option_display_name: {
        type: String
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = ProductVariantSchema
