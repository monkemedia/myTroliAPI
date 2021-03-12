const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerCouponSchema = new Schema({
  store_hash: {
    type: String,
    required: true
  },
  customer_id: {
    type: String,
    required: true
  },
  coupon_id: {
    type: String,
    required: true
  },
  uses: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
}, { versionKey: false })

module.exports = CustomerCouponSchema
