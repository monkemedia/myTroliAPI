const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  updateFacetSettings,
  getFacetSettings,
  getFacets
  // getFilterByName
} = require('../controller/productFiltering')

// Update facet settings
router.put('/product-filtering/settings', auth, (req, res) => updateFacetSettings(req, res))
// Get facet settings
router.get('/product-filtering/settings', auth, (req, res) => getFacetSettings(req, res))
// Get facets
router.get('/product-filtering', auth, (req, res) => getFacets(req, res))

// Get filter
// router.get('/product-filters/:filterName', auth, (req, res) => getFilterByName(req, res))

module.exports = router
