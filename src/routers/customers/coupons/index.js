const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createCustomerCoupon,
  getCustomerCoupons,
  getCustomerCoupon,
  incrementCustomerCoupon,
  deleteCustomerCoupon
} = require('../../../controller/customers/coupons')

// Create coupon
router.post('/customers/:customerId/coupons', auth, (req, res) => createCustomerCoupon(req, res))
// Get coupons
router.get('/customers/:customerId/coupons', auth, (req, res) => getCustomerCoupons(req, res))
// Get coupon
router.get('/customers/:customerId/coupons/:couponId', auth, (req, res) => getCustomerCoupon(req, res))
// Increment coupon
router.put('/customers/:customerId/coupons/:couponId', auth, (req, res) => incrementCustomerCoupon(req, res))
// Delete coupon
router.delete('/customers/:customerId/coupons/:couponId', auth, (req, res) => deleteCustomerCoupon(req, res))

module.exports = router
