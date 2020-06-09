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
router.post('/countries', auth, (req, res) => createCountries(req, res))
// Get countries
router.get('/countries', auth, (req, res) => getCountries(req, res))
// Get country
router.get('/countries/:countryId', auth, (req, res) => getCountry(req, res))
// Update country
router.put('/countries/:countryId', auth, (req, res) => updateCountry(req, res))
// Delete country
router.delete('/countries/:countryId', auth, (req, res) => deleteCountry(req, res))

module.exports = router
