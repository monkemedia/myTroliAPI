const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductVariant,
  getProductVariants,
  getProductVariant,
  updateProductVariant,
  deleteProductVariant
} = require('../../../controller/products/variants/index.js')

// Create product variant
router.post('/products/:productId/variants', auth, (req, res) => createProductVariant(req, res))
// Get product variants
router.get('/products/:productId/variants', auth, (req, res) => getProductVariants(req, res))
// Get product variant
router.get('/products/:productId/variants/:variantId', auth, (req, res) => getProductVariant(req, res))
// Update product variant
router.put('/products/:productId/variants/:variantId', auth, (req, res) => updateProductVariant(req, res))
// Delete product variant
router.delete('/products/:productId/variants/:variantId', auth, (req, res) => deleteProductVariant(req, res))

module.exports = router
