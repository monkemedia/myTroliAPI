const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createMerchant,
  getMerchants,
  getMerchant,
  updateMerchant,
  deleteMerchant,
  resendActivationEmail
} = require('../controller/merchant')

// Create merchant
router.post('/:storeHash/merchant', (req, res) => createMerchant(req, res))
// Get merchants
router.get('/:storeHash/merchant', auth, (req, res) => getMerchants(req, res))
// Get merchant
router.get('/:storeHash/merchant/:merchantId', auth, (req, res) => getMerchant(req, res))
// Update merchant
router.put('/:storeHash/merchant/:merchantId', auth, (req, res) => updateMerchant(req, res))
// Delete merchant
router.delete('/:storeHash/merchant/:merchantId', auth, (req, res) => deleteMerchant(req, res))
// Resend activation email
router.post('/:storeHash/merchant/resend/:merchantId', auth, (req, res) => resendActivationEmail(req, res))

module.exports = router
