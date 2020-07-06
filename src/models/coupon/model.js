const mongoose = require('mongoose')
const couponSchema = require('./schema')

couponSchema.pre('save', async function (next) {
  const coupon = this

  coupon.created_at = Date.now()
  next()
})

// Get coupons
couponSchema.statics.findCoupons = async ({ page, limit }) => {
  const coupons = await Coupon
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Coupon.countDocuments()
  return {
    data: coupons,
    meta: {
      pagination: {
        current: page,
        total: coupons.length
      },
      results: {
        total
      }
    }
  }
}

// Search coupons by code
couponSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchArray = [
    { name: { $regex: keyword, $options: 'i' } },
    { code: { $regex: keyword, $options: 'i' } }
  ]
  const coupons = await Coupon
    .find()
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Coupon.countDocuments(searchArray)
  return {
    data: coupons,
    meta: {
      pagination: {
        current: page,
        total: coupons.length
      },
      results: {
        total: total
      }
    }
  }
}

// Get coupon by Id
couponSchema.statics.findCoupon = async (couponId) => {
  const coupon = await Coupon.findOne({ _id: couponId })
  return coupon
}

// Get coupon by code
// couponSchema.statics.findCouponByCode = async (couponCode) => {
//   const coupon = await Coupon.findOne({ code: couponCode })
//   return coupon
// }

// Update coupon
couponSchema.statics.updateCoupon = async (couponId, couponDetails) => {
  const coupon = await Coupon.updateOne({ _id: couponId }, couponDetails)
  return coupon
}

// Delete coupon by id
couponSchema.statics.deleteCoupon = async (_id) => {
  const coupon = await Coupon.deleteOne({ _id })
  return coupon
}

const Coupon = mongoose.model('coupon', couponSchema)

module.exports = Coupon
