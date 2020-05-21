const express = require('express')
const router = express.Router()
const auth = require('../../../../middleware/auth')
const {
  createProductVariantImage,
  getProductVariantImages,
  getProductVariantImage,
  updateProductVariantImage,
  deleteProductVariantImage
} = require('../../../../controller/products/variants/images')

// Create a new Product Variant Image
router.post('/products/:productId/variants/:variantId/images', auth, (req, res) => createProductVariantImage(req, res))
// Get all Product Variant Images
router.get('/products/:productId/variants/:variantId/images', auth, (req, res) => getProductVariantImages(req, res))
// Get Product Variant Image
router.get('/products/:productId/variants/:variantId/images/:imageId', auth, (req, res) => getProductVariantImage(req, res))
// Update Product Variant Image
router.put('/products/:productId/variants/:variantId/images/:imageId', auth, (req, res) => updateProductVariantImage(req, res))
// Delete Product Variant Image
router.delete('/products/:productId/variants/:variantId/images', auth, (req, res) => deleteProductVariantImage(req, res))

module.exports = router
