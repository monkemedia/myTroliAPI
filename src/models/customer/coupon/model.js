const mongoose = require('mongoose')
const CustomerCouponSchema = require('./schema')

// Find customer coupons
CustomerCouponSchema.statics.findCustomerCoupons = async () => {
  const coupons = await CustomerCoupon().find()
  return coupons
}

// Find customer coupon
CustomerCouponSchema.statics.findCustomerCoupon = async (customerId, couponId) => {
  const coupon = await CustomerCoupon().findOne({
    customer_id: customerId,
    _id: couponId
  })
  return coupon
}

// Update customer coupon
CustomerCouponSchema.statics.incrementCustomerCoupon = async (customerId, couponId) => {
  const coupon = await CustomerCoupon().updateOne({
    customer_id: customerId,
    coupon_id: couponId
  }, {
    $inc: {
      uses: 1
    },
    updated_at: Date.now()
  })

  return coupon
}

// Delete customer coupon
CustomerCouponSchema.statics.deleteCustomerCoupon = async (couponId) => {
  const coupon = await CustomerCoupon().deleteOne({ _id: couponId })
  return coupon
}

const CustomerCoupon = mongoose.model('CustomerCoupon', CustomerCouponSchema)

module.exports = CustomerCoupon
