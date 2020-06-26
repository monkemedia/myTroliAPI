const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createPayment,
  getPayment,
  updatePayment,
  getBalance
} = require('../../controller/payments')

const {
  createPaymentRefund,
  getPaymentRefund
} = require('../../controller/payments/refunds')

// Create new Payment Account
router.post('/', auth, (req, res) => createPayment(req, res))
// Get payment
router.get('/:paymentId', auth, (req, res) => {
  if (req.params.paymentId === 'balance') {
    return getBalance(req, res)
  }
  return getPayment(req, res)
})
// delete image
router.put('/:paymentId', auth, (req, res) => updatePayment(req, res))

// Create Refund
router.post('/:paymentId/refunds', auth, (req, res) => createPaymentRefund(req, res))
// Get Refund
router.get('/:paymentId/refunds/:refundId', auth, (req, res) => getPaymentRefund(req, res))

module.exports = router
