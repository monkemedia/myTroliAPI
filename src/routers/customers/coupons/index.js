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
router.post('/:storeHash/customers/:customerId/coupons', auth, (req, res) => createCustomerCoupon(req, res))
// Get coupons
router.get('/:storeHash/customers/:customerId/coupons', auth, (req, res) => getCustomerCoupons(req, res))
// Get coupon
router.get('/:storeHash/customers/:customerId/coupons/:couponId', auth, (req, res) => getCustomerCoupon(req, res))
// Increment coupon
router.put('/:storeHash/customers/:customerId/coupons/:couponId', auth, (req, res) => incrementCustomerCoupon(req, res))
// Delete coupon
router.delete('/:storeHash/customers/:customerId/coupons/:couponId', auth, (req, res) => deleteCustomerCoupon(req, res))

module.exports = router
