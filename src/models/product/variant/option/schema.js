const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantOptionSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  name: {
    type: String
  },

  option1: {
    type: String,
    required: true
  },

  option2: {
    type: String,
    default: null
  },

  option3: {
    type: String,
    default: null
  },

  stock: {
    type: Number,
    required: true
  },

  price: {
    type: Object,
    required: true
  },

  product_id: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = productVariantOptionSchema
