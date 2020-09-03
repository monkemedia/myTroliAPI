const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrySchema = new Schema({
  type: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  country_iso: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = CountrySchema
