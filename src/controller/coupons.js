const errorHandler = require('../utils/errorHandler')
const Coupon = require('../models/coupon')

const couponTypes = [
  'per_item_discount',
  'percentage_discount',
  'per_total_discount',
  'shipping_discount',
  'free_shipping'
]

const createCoupon = async (req, res) => {
  const data = req.body
  const {
    name,
    code,
    coupon_type,
    amount,
    enabled
  } = data
  const store_hash = req.params.storeHash

  if (!name) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (!code) {
    return res.status(401).send({
      message: 'Code is required'
    })
  }

  if (!coupon_type) {
    return res.status(401).send({
      message: 'Coupon type is required'
    })
  }

  if (!couponTypes.includes(coupon_type)) {
    return res.status(401).send({
      message: 'Correct coupon type is required'
    })
  }

  if (isNaN(amount)) {
    return res.status(401).send({
      message: 'Amount is required'
    })
  }

  if (typeof amount !== 'number') {
    return res.status(401).send({
      message: 'Amount requires a number'
    })
  }

  if (!enabled) {
    return res.status(401).send({
      message: 'Enabled is required'
    })
  }

  try {
    const coupons = new Coupon({
      ...data,
      store_hash
    })

    await coupons.save()

    res.status(201).send(coupons)
  } catch (err) {
    res.status(400).send(errorHandler(400, err))
  }
}

const getCoupons = async (req, res) => {
  const query = req.query
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 20
  const keyword = query && query.keyword
  const store_hash = req.params.storeHash
  let coupons

  try {
    if (keyword) {
      coupons = await Coupon.search({ page, limit, keyword, store_hash })
    } else {
      coupons = await Coupon.findCoupons({ page, limit, store_hash })
    }

    res.status(200).send(coupons)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCoupon = async (req, res) => {
  const couponId = req.params.couponId

  try {
    const coupon = await Coupon.findOne({ _id: couponId })

    res.status(200).send(coupon)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCouponByCode = async (req, res) => {
  const couponCode = req.params.couponCode
  const store_hash = req.params.storeHash

  try {
    const coupon = await Coupon.findCouponByCode(couponCode, store_hash)

    res.status(200).send(coupon)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateCoupon = async (req, res) => {
  const couponId = req.params.couponId
  const data = req.body

  try {
    await Coupon.updateCoupon(couponId, data)
    const coupon = await Coupon.findOne({ _id: couponId })

    res.status(200).send(coupon)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.deleteCoupon(req.params.couponId)

    res.status(200).send({
      message: 'Coupon successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  getCouponByCode,
  updateCoupon,
  deleteCoupon
}
