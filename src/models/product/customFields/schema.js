const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductCustomFieldSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  product_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = ProductCustomFieldSchema
