const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurrencySchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  currency_code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  currency_symbol: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

module.exports = CurrencySchema
