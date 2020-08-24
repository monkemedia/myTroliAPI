const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createCountries,
  getCountries,
  getCountry,
  updateCountry,
  deleteCountry
} = require('../controller/countries.js')

// Create countries
router.post('/:storeHash/countries', auth, (req, res) => createCountries(req, res))
// Get countries
router.get('/:storeHash/countries', auth, (req, res) => getCountries(req, res))
// Get country
router.get('/:storeHash/countries/:countryId', auth, (req, res) => getCountry(req, res))
// Update country
router.put('/:storeHash/countries/:countryId', auth, (req, res) => updateCountry(req, res))
// Delete country
router.delete('/:storeHash/countries/:countryId', auth, (req, res) => deleteCountry(req, res))

module.exports = router
