const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shippingZoneSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: null
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
    type: String,
    default: null
  },
  order_price: {
    type: Object,
    required: false
  },
  order_weight: {
    type: Object,
    required: false
  },
  enabled: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

module.exports = shippingZoneSchema
