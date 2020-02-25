const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductVariant,
  getProductVariants,
  getProductVariant,
  deleteProductVariant
} = require('../../../controller/products/variants/index.js')

// Create a new variant
router.post('/products/:productId/variants', auth, (req, res) => createProductVariant(req, res))
// Get all variants
router.get('/products/:productId/variants', auth, (req, res) => getProductVariants(req, res))
// Get variant
router.get('/products/:productId/variants/:variantId', auth, (req, res) => getProductVariant(req, res))
// Delete variant
router.delete('/products/:productId/variants/:variantId', auth, (req, res) => deleteProductVariant(req, res))

module.exports = router
