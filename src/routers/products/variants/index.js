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
router.post('/:storeHash/products/:productId/variants', auth, (req, res) => createProductVariant(req, res))
// Get product variants
router.get('/:storeHash/products/:productId/variants', auth, (req, res) => getProductVariants(req, res))
// Get product variant
router.get('/:storeHash/products/:productId/variants/:variantId', auth, (req, res) => getProductVariant(req, res))
// Update product variant
router.put('/:storeHash/products/:productId/variants/:variantId', auth, (req, res) => updateProductVariant(req, res))
// Delete product variant
router.delete('/:storeHash/products/:productId/variants/:variantId', auth, (req, res) => deleteProductVariant(req, res))

module.exports = router
