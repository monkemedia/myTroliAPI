const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createPayment,
  getPayment,
  updatePayment
} = require('../../controller/payments')

// Create new Payment Account
router.post('/', auth, (req, res) => createPayment(req, res))

// Get payment
router.get('/:chargeId', auth, (req, res) => getPayment(req, res))
// delete image
router.put('/:chargeId', auth, (req, res) => updatePayment(req, res))

module.exports = router
