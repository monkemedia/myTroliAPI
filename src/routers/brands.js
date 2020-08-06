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
router.post('/brands', auth, (req, res) => createBrand(req, res))
// Get brands
router.get('/brands', auth, (req, res) => getBrands(req, res))
// Get brand
router.get('/brands/:brandId', auth, (req, res) => getBrand(req, res))
// Update brand
router.put('/brands/:brandId', auth, (req, res) => updateBrand(req, res))
// Delete brand
router.delete('/brands/:brandId', auth, (req, res) => deleteBrand(req, res))

module.exports = router
