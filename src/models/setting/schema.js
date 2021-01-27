const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingSchema = Schema({
  type: {
    type: String,
    required: true
  },
  store_hash: {
    type: String,
    required: true
  },
  variant_presets: {
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

module.exports = SettingSchema
