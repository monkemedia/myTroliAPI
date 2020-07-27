const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shippingAddressSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  company_name: {
    type: String
  },
  line_1: {
    type: String,
    required: true
  },
  line_2: {
    type: String
  },
  city: {
    type: String
  },
  postcode: {
    type: String,
    required: true
  },
  country_code: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone_number: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = shippingAddressSchema
