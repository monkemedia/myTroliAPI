const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } = require('../../controller/customers')

// Create a new customer
router.post('/customers', async (req, res) => createCustomer(req, res))
// Get all customer
router.get('/customers', auth, async (req, res) => getCustomers(req, res))
// Get customer
router.get('/customers/:customerId', auth, async (req, res) => getCustomer(req, res))
// Update customer
router.put('/customers/:customerId', auth, async (req, res) => updateCustomer(req, res))
// Delete customer
router.delete('/customers/:customerId', auth, async (req, res) => deleteCustomer(req, res))

module.exports = router
