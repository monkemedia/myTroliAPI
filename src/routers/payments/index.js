const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createPayment,
  getPayment,
  updatePayment
} = require('../../controller/payments')

// Create new Payment Account
router.post('/:storeHash/payments', auth, (req, res) => createPayment(req, res))

// Get payment
router.get('/:storeHash/payments/:chargeId', auth, (req, res) => getPayment(req, res))
// delete image
router.put('/:storeHash/payments/:chargeId', auth, (req, res) => updatePayment(req, res))

module.exports = router
