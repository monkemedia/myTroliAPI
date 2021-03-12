const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrySchema = new Schema({
  country: {
    type: String,
  },
  country_iso: {
    type: String,
    required: true
  }
}, { versionKey: false })

module.exports = CountrySchema
