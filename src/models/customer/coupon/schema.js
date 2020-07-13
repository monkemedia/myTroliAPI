const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerCouponSchema = new Schema({
  type: {
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
  }
}, { versionKey: false })

module.exports = customerCouponSchema
