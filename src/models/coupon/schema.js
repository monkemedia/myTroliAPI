const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponSchema = Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  coupon_type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  expiry: {
    type: Date,
    default: null
  },
  number_uses: {
    type: Number,
    default: 0
  },
  max_uses: {
    type: Number,
    default: null
  },
  max_uses_per_customer: {
    type: Number,
    default: null
  },
  min_purchase: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = couponSchema
