const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shippingZoneSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  rule: {
    type: String,
    default: 'flatrate'
  },
  zone_id: {
    type: String
  },
  order_price: {
    type: Object
  },
  order_weight: {
    type: Object
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
