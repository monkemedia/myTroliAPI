const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  getOrderStatuses,
  getOrderStatus
} = require('../../../controller/orders/status')

// Get order statuss
router.get('/:storeHash/order_status', auth, (req, res) => getOrderStatuses(req, res))
// Get order status
router.get('/:storeHash/order_status/:orderStatusId', auth, (req, res) => getOrderStatus(req, res))

module.exports = router
