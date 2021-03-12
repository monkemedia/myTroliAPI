const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VariantSchema = new Schema({
  store_hash: {
    type: String,
    required: true
  },
  value: {
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

module.exports = VariantSchema
