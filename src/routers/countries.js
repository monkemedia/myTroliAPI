const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  getCountries,
  getCountry,
} = require('../controller/countries.js')

// Get countries
router.get('/:storeHash/countries', auth, (req, res) => getCountries(req, res))
// Get country
router.get('/:storeHash/countries/:countryId', auth, (req, res) => getCountry(req, res))

module.exports = router
