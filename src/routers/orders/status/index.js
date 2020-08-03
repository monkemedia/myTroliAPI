const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createOrderStatus,
  getOrderStatuses,
  getOrderStatus,
  updateOrderStatus,
  deleteOrderStatus
} = require('../../../controller/orders/status')

// Create order status
router.post('/order_status', auth, (req, res) => createOrderStatus(req, res))
// Get order statuss
router.get('/order_status', auth, (req, res) => getOrderStatuses(req, res))
// Get order status
router.get('/order_status/:orderStatusId', auth, (req, res) => getOrderStatus(req, res))
// Update order status
router.put('/order_status/:orderStatusId', auth, (req, res) => updateOrderStatus(req, res))
// Delete order status
router.delete('/order_status/:orderStatusId', auth, (req, res) => deleteOrderStatus(req, res))

module.exports = router
