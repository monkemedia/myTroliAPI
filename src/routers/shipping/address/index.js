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
router.post('/:storeHash/shipping/address', auth, (req, res) => createShippingAddress(req, res))
// Get shipping address
router.get('/:storeHash/shipping/address', auth, (req, res) => getShippingAddress(req, res))
// Update shipping address
router.put('/:storeHash/shipping/address', auth, (req, res) => updateShippingAddress(req, res))
// Delete shipping address
router.delete('/:storeHash/shipping/address', auth, (req, res) => deleteShippingAddress(req, res))

module.exports = router
