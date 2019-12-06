const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { createAddress, getAddresses, getAddress, updateAddress, deleteAddress } = require('../../controller/addresses')

// Create a new address
router.post('/customers/:customerId/addresses', auth, (req, res) => createAddress(req, res))
// Get all addresses
router.get('/customers/:customerId/addresses', auth, (req, res) => getAddresses(req, res))
// Get an address
router.get('/customers/:customerId/addresses/:addressId', auth, (req, res) => getAddress(req, res))
// Update can address
router.put('/customers/:customerId/addresses/:addressId', auth, (req, res) => updateAddress(req, res))
// Delete an address
router.delete('/customers/:customerId/addresses/:addressId', auth, (req, res) => deleteAddress(req, res))

module.exports = router
