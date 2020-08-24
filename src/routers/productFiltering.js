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
router.put('/:storeHash/product-filtering/settings', auth, (req, res) => updateFacetSettings(req, res))
// Get facet settings
router.get('/:storeHash/product-filtering/settings', auth, (req, res) => getFacetSettings(req, res))
// Get facets
router.get('/:storeHash/product-filtering', auth, (req, res) => getFacets(req, res))

module.exports = router
