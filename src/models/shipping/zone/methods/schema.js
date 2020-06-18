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
  shipping_cost: {
    type: Number,
    required: false
  },
  shipping_zone_id: {
    type: String,
    required: true
  },
  range: [{
    lower_limit: {
      type: Number,
      required: false
    },
    upper_limit: {
      type: Number,
      required: false
    },
    shipping_cost: {
      type: Number,
      required: false
    }
  }],
  enabled: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

module.exports = shippingZoneSchema
