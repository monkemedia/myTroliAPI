const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productImageSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  image_id: {
    type: String,
    required: true,
    unique: true
  },
  image_url: {
    type: String,
    required: true
  },
  product_id: {
    type: String,
    required: true
  },
  sort_order: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  is_thumbnail: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

module.exports = productImageSchema
