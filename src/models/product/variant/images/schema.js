const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantImageSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  image_id: {
    type: String,
    required: true,
    unique: true
  },
  product_id: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  variant_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, { versionKey: false })

module.exports = productVariantImageSchema
