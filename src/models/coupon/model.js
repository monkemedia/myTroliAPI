const mongoose = require('mongoose')
const CouponSchema = require('./schema')
const errorHandler = require('../../utils/errorHandler')

CouponSchema.pre('save', async function (next) {
  const coupon = this

  coupon.created_at = Date.now()
  next()
})

// Get coupons
CouponSchema.statics.findCoupons = async ({ page, limit }) => {
  const coupon = new Coupon()
  const coupons = await coupon
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await coupon.countDocuments()
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
CouponSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchArray = [
    { name: { $regex: keyword, $options: 'i' } },
    { code: { $regex: keyword, $options: 'i' } }
  ]
  const coupon = new Coupon()
  const coupons = await coupon
    .find()
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await coupon.countDocuments(searchArray)
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

// Get coupon by code
CouponSchema.statics.findCouponByCode = async (couponCode) => {
  const coupon = await Coupon().findOne({ code: couponCode })

  // Check to see if coupon exists
  if (!coupon) {
    throw errorHandler(422, 'Coupon does not exist.')
  }

  // Check to see if coupon has expired
  if (coupon.expiry && new Date(coupon.expiry).toISOString() < new Date().toISOString()) {
    throw errorHandler(422, 'Coupon has expired.')
  }

  return coupon
}

// Update coupon
CouponSchema.statics.updateCoupon = async (couponId, couponDetails) => {
  let couponResp
  const incrementUsage = couponDetails.increment_usage
  const coupon = new Coupon()

  if (incrementUsage) {
    couponResp = await coupon.updateOne({ _id: couponId }, {
      $inc: {
        number_uses: incrementUsage
      },
      updated_at: Date.now()
    })
  } else {
    couponResp = await coupon.updateOne({ _id: couponId }, {
      ...couponDetails,
      updated_at: Date.now()
    })
  }

  return couponResp
}

// Delete coupon by id
CouponSchema.statics.deleteCoupon = async (_id) => {
  const coupon = await Coupon().deleteOne({ _id })
  return coupon
}

const Coupon = mongoose.model('Coupon', CouponSchema)

module.exports = Coupon
