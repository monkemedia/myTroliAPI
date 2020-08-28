const CouponSchema = require('./schema')
const errorHandler = require('../../utils/errorHandler')
const { tenantModel } = require('../../utils/multitenancy')

CouponSchema.pre('save', async function (next) {
  const coupon = this

  coupon.created_at = Date.now()
  next()
})

// Get coupons
CouponSchema.statics.findCoupons = async ({ page, limit }) => {
  const coupons = await Coupon()
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Coupon().countDocuments()
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
  const coupons = await Coupon()
    .find()
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Coupon().countDocuments(searchArray)
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
  let coupon
  const incrementUsage = couponDetails.increment_usage

  if (incrementUsage) {
    coupon = await Coupon().updateOne({ _id: couponId }, {
      $inc: {
        number_uses: incrementUsage
      },
      updated_at: Date.now()
    })
  } else {
    coupon = await Coupon().updateOne({ _id: couponId }, {
      ...couponDetails,
      updated_at: Date.now()
    })
  }

  return coupon
}

// Delete coupon by id
CouponSchema.statics.deleteCoupon = async (_id) => {
  const coupon = await Coupon().deleteOne({ _id })
  return coupon
}

const Coupon = function () {
  return tenantModel('Coupon', CouponSchema)
}
module.exports = Coupon
