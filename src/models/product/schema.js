const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'draft'
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Object,
    required: true
  },
  sale_price: {
    type: Object,
    default: 0
  },
  on_sale: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'GBP'
    }
  },
  commodity_type: {
    type: String,
    required: true
  },
  meta: {
    type: Object,
    required: false
  },
  relationships: {
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductFileRelationship'
      }
    ]
  },
  categories: {
    type: Schema.Types.ObjectId,
    ref: 'ProductCategories'
  },
  variants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProductVariants'
    }
  ],
  options: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProductOptions'
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: ''
  }
}, { versionKey: false })

module.exports = productSchema
