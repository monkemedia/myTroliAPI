const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const {
  createProductReview,
  getProductReviews,
  getProductReview,
  updateProductReview,
  deleteProductReview
} = require('../../../controller/products/reviews/index.js')

// Create product review
router.post('/:storeHash/products/:productId/reviews', auth, (req, res) => createProductReview(req, res))
// Get All product reviews
router.get('/:storeHash/products/reviews', auth, (req, res) => getProductReviews(req, res))
// Get product reviews
router.get('/:storeHash/products/:productId/reviews', auth, (req, res) => getProductReviews(req, res))
// Get product review
router.get('/:storeHash/products/:productId/reviews/:reviewId', auth, (req, res) => getProductReview(req, res))
// Update product review
router.put('/:storeHash/products/:productId/reviews/:reviewId', auth, (req, res) => updateProductReview(req, res))
// Delete product review
router.delete('/:storeHash/products/:productId/reviews/:reviewId', auth, (req, res) => deleteProductReview(req, res))

module.exports = router
