const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shippingZoneSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  country_code: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = shippingZoneSchema
