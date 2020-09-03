const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createCoupon,
  getCoupons,
  getCoupon,
  getCouponByCode,
  updateCoupon,
  deleteCoupon
} = require('../controller/coupons')

// Create coupon
router.post('/:storeHash/coupons', auth, (req, res) => createCoupon(req, res))
// Get coupons
router.get('/:storeHash/coupons', auth, (req, res) => getCoupons(req, res))
// Get couponByCode
router.get('/:storeHash/coupons/code/:couponCode', auth, (req, res) => getCouponByCode(req, res))
// Get coupon
router.get('/:storeHash/coupons/:couponId', auth, (req, res) => getCoupon(req, res))
// Update coupon
router.put('/:storeHash/coupons/:couponId', auth, (req, res) => updateCoupon(req, res))
// Delete coupon
router.delete('/:storeHash/coupons/:couponId', auth, (req, res) => deleteCoupon(req, res))

module.exports = router
