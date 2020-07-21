const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = Schema({
  type: {
    type: String,
    required: true
  },
  variant_presets: {
    type: Array
  }
}, { versionKey: false })

module.exports = couponSchema
