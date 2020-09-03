const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createOrderRefund,
  getOrderRefunds
} = require('../../../controller/orders/refunds')

// Create order refund
router.post('/:storeHash/orders/:orderId/refunds', auth, (req, res) => createOrderRefund(req, res))
// Get refunds for order
router.get('/:storeHash/orders/:orderId/refunds', auth, (req, res) => getOrderRefunds(req, res))

module.exports = router
