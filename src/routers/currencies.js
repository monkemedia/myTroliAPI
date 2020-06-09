const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createCurrencies,
  getCurrencies,
  getCurrency,
  updateCurrency,
  deleteCurrency
} = require('../controller/currencies.js')

// Create currencies
router.post('/currencies', auth, (req, res) => createCurrencies(req, res))
// Get currencies
router.get('/currencies', auth, (req, res) => getCurrencies(req, res))
// Get currency
router.get('/currencies/:currencyId', auth, (req, res) => getCurrency(req, res))
// Update currency
router.put('/currencies/:currencyId', auth, (req, res) => updateCurrency(req, res))
// Delete currency
router.delete('/currencies/:currencyId', auth, (req, res) => deleteCurrency(req, res))

module.exports = router
