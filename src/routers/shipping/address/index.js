const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress
} = require('../../../controller/shipping/address')

// Create shipping address
router.post('/shipping/address', auth, (req, res) => createShippingAddress(req, res))
// Get shipping address
router.get('/shipping/address', auth, (req, res) => getShippingAddress(req, res))
// Update shipping address
router.put('/shipping/address', auth, (req, res) => updateShippingAddress(req, res))
// Delete shipping address
router.delete('/shipping/address', auth, (req, res) => deleteShippingAddress(req, res))

module.exports = router
