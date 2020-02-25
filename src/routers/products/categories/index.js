const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { createProductCategory, updateProductCategory, deleteProductCategory } = require('../../../controller/products/categories')

// Create a new Product Category
router.post('/products/:productId/categories', auth, (req, res) => createProductCategory(req, res))
// Update a Product Category
router.put('/products/:productId/relationships/categories/:categoryId', auth, (req, res) => updateProductCategory(req, res))
// Delete Product Category
router.delete('/products/:productId/relationships/categories/:categoryId', auth, (req, res) => deleteProductCategory(req, res))

module.exports = router
