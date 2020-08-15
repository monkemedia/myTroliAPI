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
router.post('/products/:productId/reviews', auth, (req, res) => createProductReview(req, res))
// Get product reviews
router.get('/products/:productId/reviews', auth, (req, res) => getProductReviews(req, res))
// Get product review
router.get('/products/:productId/reviews/:reviewId', auth, (req, res) => getProductReview(req, res))
// Update product review
router.put('/products/:productId/reviews/:reviewId', auth, (req, res) => updateProductReview(req, res))
// Delete product review
router.delete('/products/:productId/reviews/:reviewId', auth, (req, res) => deleteProductReview(req, res))

module.exports = router
