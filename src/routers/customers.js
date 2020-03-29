const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controller/customers')

// Create customer
router.post('/customers', (req, res) => createCustomer(req, res))
// Get customers
router.get('/customers', auth, (req, res) => getCustomers(req, res))
// Get customer
router.get('/customers/:customerId', auth, (req, res) => getCustomer(req, res))
// Update customer
router.put('/customers/:customerId', auth, (req, res) => updateCustomer(req, res))
// Delete customer
router.delete('/customers/:customerId', auth, (req, res) => deleteCustomer(req, res))

module.exports = router
