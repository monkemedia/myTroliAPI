const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productVariantOptionSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  variant_id: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = productVariantOptionSchema
