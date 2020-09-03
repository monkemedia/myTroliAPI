const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createCustomerAddress,
  getCustomerAddresses,
  getCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
} = require('../../../controller/customers/addresses')

// Create address
router.post('/:storeHash/customers/:customerId/addresses', auth, (req, res) => createCustomerAddress(req, res))
// Get addresses
router.get('/:storeHash/customers/:customerId/addresses', auth, (req, res) => getCustomerAddresses(req, res))
// Get address
router.get('/:storeHash/customers/:customerId/addresses/:addressId', auth, (req, res) => getCustomerAddress(req, res))
// Update address
router.put('/:storeHash/customers/:customerId/addresses/:addressId', auth, (req, res) => updateCustomerAddress(req, res))
// Delete address
router.delete('/:storeHash/customers/:customerId/addresses/:addressId', auth, (req, res) => deleteCustomerAddress(req, res))

module.exports = router
