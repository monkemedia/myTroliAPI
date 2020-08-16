const mongoose = require('mongoose')
const productReviewSchema = require('./schema')
const Product = require('../model')

// Get product reviews
productReviewSchema.statics.findProductReviews = async ({page, limit, productId}) => {
  const query = {}

  if (productId) {
    Object.assign(query, { product_id: productId })
  }

  const productReviews = await ProductReviews
    .find(query)
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
}

// Search product reviews by Author or status
productReviewSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchQuery = {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { status: { $regex: keyword, $options: 'i' } }
    ]
  }
  const productReviews = await ProductReviews
    .find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('images')

  const total = await Product.countDocuments(searchQuery)
  return {
    data: productReviews,
    meta: {
      pagination: {
        current: page,
        total: productReviews.length
      },
      results: {
        total: total
      }
    }
  }
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
