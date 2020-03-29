const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress
} = require('../controller/addresses')

// Create address
router.post('/customers/:customerId/addresses', auth, (req, res) => createAddress(req, res))
// Get addresses
router.get('/customers/:customerId/addresses', auth, (req, res) => getAddresses(req, res))
// Get address
router.get('/customers/:customerId/addresses/:addressId', auth, (req, res) => getAddress(req, res))
// Update address
router.put('/customers/:customerId/addresses/:addressId', auth, (req, res) => updateAddress(req, res))
// Delete address
router.delete('/customers/:customerId/addresses/:addressId', auth, (req, res) => deleteAddress(req, res))

module.exports = router
