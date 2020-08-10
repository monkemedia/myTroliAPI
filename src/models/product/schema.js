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
  track_inventory: {
    type: String,
    enum: ['none', 'product-inventory', 'variant-inventory'],
    default: 'none'
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
  commodity_type: {
    type: String,
    required: true
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProductImage'
    }
  ],
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
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Categories'
    }
  ],
  weight: {
    type: Number
  },
  width: {
    type: Number
  },
  depth: {
    type: Number
  },
  height: {
    type: Number
  },
  fixed_shipping_cost: {
    type: Number
  },
  is_free_shipping: {
    type: Boolean,
    default: false
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  total_sold: {
    type: Number,
    default: 0
  },
  search_keywords: {
    type: Array
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = productSchema
