const mongoose = require('mongoose')
const productReviewSchema = require('./schema')
const Product = require('../model')

// Get product reviews
productReviewSchema.statics.findProductReviews = async ({page, limit, productId}) => {
  const productReviews = await ProductReviews
    .find({ product_id: productId })
    .sort({ sort_order: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await ProductReviews.countDocuments()

  return {
    data: productReviews,
    meta: {
      pagination: {
        current: page,
        total: productReviews.length
      },
      results: {
        total
      }
    }
  }

  return productReviews
}

// Update product review
productReviewSchema.statics.updateProductReview = async (reviewId, productReviewDetails) => {
  const productReview = await ProductReviews.updateOne({ _id: reviewId }, {
    ...productReviewDetails,
    updated_at: Date.now()
  })
  return productReview
}

// Delete product review
productReviewSchema.statics.deleteProductReview = async (reviewId, productId) => {
  await Product.updateOne({ _id: productId }, {
    $pull: {
      custom_fields: reviewId
    },
    updated_at: Date.now()
  })
  const productReview = await ProductReviews.deleteOne({ _id: reviewId })
  return productReview
}

const ProductReviews = mongoose.model('ProductReviews', productReviewSchema)

module.exports = ProductReviews
