const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createOrder,
  getOrders,
  getOrderCount,
  getOrder,
  updateOrder,
  deleteOrder
} = require('../../controller/orders')

// Create order
router.post('/:storeHash/orders', auth, (req, res) => createOrder(req, res))
// Get orders
router.get('/:storeHash/orders', auth, (req, res) => getOrders(req, res))
// Get order count
router.get('/:storeHash/orders/count', auth, (req, res) => getOrderCount(req, res))
// Get order
router.get('/:storeHash/orders/:orderId', auth, (req, res) => getOrder(req, res))
// Update order
router.put('/:storeHash/orders/:orderId', auth, (req, res) => updateOrder(req, res))
// Delete order
router.delete('/:storeHash/orders/:orderId', auth, (req, res) => deleteOrder(req, res))

module.exports = router
