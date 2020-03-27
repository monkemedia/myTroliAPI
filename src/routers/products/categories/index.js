const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductCategories,
  getProductCategory,
  updateProductCategories,
  deleteProductCategories
} = require('../../../controller/products/categories')

// Create Product Category
router.post('/products/:productId/categories', auth, (req, res) => createProductCategories(req, res))
// Get Product Category
router.get('/products/:productId/categories', auth, (req, res) => getProductCategory(req, res))
// Update Product Category
router.put('/products/:productId/categories', auth, (req, res) => updateProductCategories(req, res))
// Delete Product Category
router.delete('/products/:productId/categories', auth, (req, res) => deleteProductCategories(req, res))

module.exports = router
