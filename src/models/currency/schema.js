const mongoose = require('mongoose')
const Schema = mongoose.Schema

const currencySchema = new Schema({
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
    unique: true
  },
  enabled: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

module.exports = currencySchema
