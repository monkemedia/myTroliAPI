const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantSchema = new Schema({
  type: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  price: {
    type: Object,
    required: true
  },

  variant_id: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = productVariantSchema
