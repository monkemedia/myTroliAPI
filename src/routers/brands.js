const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand
} = require('../controller/brands')

// Create brand
router.post('/:storeHash/brands', auth, (req, res) => createBrand(req, res))
// Get brands
router.get('/:storeHash/brands', auth, (req, res) => getBrands(req, res))
// Get brand
router.get('/:storeHash/brands/:brandId', auth, (req, res) => getBrand(req, res))
// Update brand
router.put('/:storeHash/brands/:brandId', auth, (req, res) => updateBrand(req, res))
// Delete brand
router.delete('/:storeHash/brands/:brandId', auth, (req, res) => deleteBrand(req, res))

module.exports = router
