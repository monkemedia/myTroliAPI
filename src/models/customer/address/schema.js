const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerAddressSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  customer_id: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: false
  },
  line_1: {
    type: String,
    required: true
  },
  line_2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
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
    type: String,
    required: false
  },
  instructions: {
    type: String,
    required: false
  },
  default: {
    type: Boolean,
    required: false,
    default: false
  }
}, { versionKey: false })

module.exports = customerAddressSchema
