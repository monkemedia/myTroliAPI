const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductCategories,
  updateProductCategories,
  deleteProductCategories
} = require('../../../controller/products/categories')

// Create product categories
router.post('/products/:productId/categories', auth, (req, res) => createProductCategories(req, res))
// Update product categories
router.put('/products/:productId/categories', auth, (req, res) => updateProductCategories(req, res))
// Delete product categories
router.delete('/products/:productId/categories', auth, (req, res) => deleteProductCategories(req, res))

module.exports = router
