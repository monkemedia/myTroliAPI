const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../../controller/products')

// Create product
router.post('/products', auth, (req, res) => createProduct(req, res))
// Get products
router.get('/products', auth, (req, res) => getProducts(req, res))
// Get product
router.get('/products/:productId', auth, (req, res) => getProduct(req, res))
// Update product
router.put('/products/:productId', auth, (req, res) => updateProduct(req, res))
// Delete product
router.delete('/products/:productId', auth, (req, res) => deleteProduct(req, res))

module.exports = router
