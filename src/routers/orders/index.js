const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require('../../controller/orders')

// Create order
router.post('/orders', auth, (req, res) => createOrder(req, res))
// Get orders
router.get('/orders', auth, (req, res) => getOrders(req, res))
// Get order
router.get('/orders/:orderId', auth, (req, res) => getOrder(req, res))
// Update order
router.put('/orders/:orderId', auth, (req, res) => updateOrder(req, res))
// Delete order
router.delete('/orders/:orderId', auth, (req, res) => deleteOrder(req, res))

module.exports = router
