const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductCategories,
  getProductCategory,
  updateProductCategories,
  deleteProductCategories
} = require('../../../controller/products/categories')

// Create product categories
router.post('/products/:productId/categories', auth, (req, res) => createProductCategories(req, res))
// Get product category
router.get('/products/:productId/categories', auth, (req, res) => getProductCategory(req, res))
// Update product category
router.put('/products/:productId/categories', auth, (req, res) => updateProductCategories(req, res))
// Delete product categories
router.delete('/products/:productId/categories', auth, (req, res) => deleteProductCategories(req, res))

module.exports = router
