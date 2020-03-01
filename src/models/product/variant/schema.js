const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  name: {
    type: Schema.Types.ObjectId,
    ref: 'Variation'
  },

  is_priced: {
    type: String,
    default: false
  },

  has_stock: {
    type: String,
    default: false
  },

  product_id: {
    type: String,
    required: true
  },

  options: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductVariantOptions'
  }]
}, { versionKey: false })

module.exports = productVariantSchema
