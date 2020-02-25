const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductCategory,
  getProductCategories,
  getProductCategory,
  deleteProductCategory
} = require('../../../controller/products/categories')

// Create a new Product Category
router.post('/products/:productId/categories', auth, (req, res) => createProductCategory(req, res))
// Get Product Categories
router.get('/products/:productId/categories', auth, (req, res) => getProductCategories(req, res))
// Get Product Category
router.get('/products/:productId/categories/:categoryId', auth, (req, res) => getProductCategory(req, res))
// Delete Product Category
router.delete('/products/:productId/categories/:categoryId', auth, (req, res) => deleteProductCategory(req, res))

module.exports = router
