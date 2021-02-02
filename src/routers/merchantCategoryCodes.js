const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getMerchantCategoryCodes,
  getMerchantCategoryCode
} = require('../controller/merchantCategoryCodes')

// Get Merchant Category Codess
router.get('/:storeHash/merchant-category-codes', auth, (req, res) => getMerchantCategoryCodes(req, res))
// Get Merchant Category Code
router.get('/:storeHash/merchant-category-codes/:mcc', auth, (req, res) => getMerchantCategoryCode(req, res))

module.exports = router
