const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductImage,
  getProductImages,
  getProductImage,
  updateProductImage,
  deleteProductImage
} = require('../../../controller/products/images')

// Create a new Product Image
router.post('/:storeHash/products/:productId/images', auth, (req, res) => createProductImage(req, res))
// Get all Product Images
router.get('/:storeHash/products/:productId/images', auth, (req, res) => getProductImages(req, res))
// Get Product Image
router.get('/:storeHash/products/:productId/images/:imageId', auth, (req, res) => getProductImage(req, res))
// Update Product Image
router.put('/:storeHash/products/:productId/images/:imageId', auth, (req, res) => updateProductImage(req, res))
// Delete Product Image
router.delete('/:storeHash/products/:productId/images', auth, (req, res) => deleteProductImage(req, res))

module.exports = router
