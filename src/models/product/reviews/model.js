const mongoose = require('mongoose')
const ProductReviewSchema = require('./schema')
const Product = require('../model')

// Get product reviews
ProductReviewSchema.statics.findProductReviews = async ({ page, limit, productId, store_hash }) => {
  const query = { store_hash }

  if (productId) {
    Object.assign(query, { product_id: productId })
  }
  const productReviews = await ProductReview
    .find(query)
    .sort({ sort_order: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await ProductReview.countDocuments({ store_hash })

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
ProductReviewSchema.statics.search = async ({ page, limit, keyword, store_hash }) => {
  const searchQuery = {
    store_hash,
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { status: { $regex: keyword, $options: 'i' } }
    ]
  }

  const productReviews = await ProductReview
    .find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('images')

  const total = await ProductReview.countDocuments(searchQuery)
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
ProductReviewSchema.statics.updateProductReview = async (reviewId, productReviewDetails) => {
  const productReview = await ProductReview.updateOne({ _id: reviewId }, {
    ...productReviewDetails,
    updated_at: Date.now()
  })
  return productReview
}

// Delete product review
ProductReviewSchema.statics.deleteProductReview = async (reviewId, productId) => {
  await Product.updateOne({ _id: productId }, {
    $pull: {
      custom_fields: reviewId
    },
    updated_at: Date.now()
  })
  const productReview = await ProductReview.deleteOne({ _id: reviewId, store_hash })
  return productReview
}

const ProductReview = mongoose.model('ProductReview', ProductReviewSchema)

module.exports = ProductReview
