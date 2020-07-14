const mongoose = require('mongoose')
const customerCouponSchema = require('./schema')

// Find customer coupons
customerCouponSchema.statics.findCustomerCoupons = async (customerId) => {
  const coupons = await CustomerCoupon.find()
  return coupons
}

// Find customer coupon
customerCouponSchema.statics.findCustomerCoupon = async (customerId, couponId) => {
  const coupon = await CustomerCoupon.findOne({
    customer_id: customerId,
    coupon_id: couponId
  })
  return coupon
}

// Update customer coupon
customerCouponSchema.statics.incrementCustomerCoupon = async (customerId, couponId) => {
  const coupon = await CustomerCoupon.updateOne({
    customer_id: customerId,
    coupon_id: couponId
  }, {
    $inc: {
      uses: 1
    }
  })

  return coupon
}

// Delete customer coupon
customerCouponSchema.statics.deleteCustomerCoupon = async (couponId) => {
  const coupon = await CustomerCoupon.deleteOne({ _id: couponId })
  return coupon
}

const CustomerCoupon = mongoose.model('CustomerCoupon', customerCouponSchema)

module.exports = CustomerCoupon
