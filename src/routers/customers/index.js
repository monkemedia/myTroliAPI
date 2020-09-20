const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  resendVerificationEmail,
  verifyCustomer
} = require('../../controller/customers')

// Create customer
router.post('/:storeHash/customers', auth, (req, res) => createCustomer(req, res))
// Get customers
router.get('/:storeHash/customers', auth, (req, res) => getCustomers(req, res))
// Get customer
router.get('/:storeHash/customers/:customerId', auth, (req, res) => getCustomer(req, res))
// Update customer
router.put('/:storeHash/customers/:customerId', auth, (req, res) => updateCustomer(req, res))
// Delete customer
router.delete('/:storeHash/customers/:customerId', auth, (req, res) => deleteCustomer(req, res))
// Resend verification email
router.post('/:storeHash/customers/resend/:customerId', auth, (req, res) => resendVerificationEmail(req, res))
// Verify customer email address
router.post('/customers/verify', (req, res) => verifyCustomer(req, res))

module.exports = router
