const ProductReviewSchema = require('./schema')
const Product = require('../model')
const { tenantModel } = require('../../../utils/multitenancy');

// Get product reviews
ProductReviewSchema.statics.findProductReviews = async ({page, limit, productId}) => {
  const query = {}

  if (productId) {
    Object.assign(query, { product_id: productId })
  }

  const productReviews = await ProductReview()
    .find(query)
    .sort({ sort_order: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await ProductReview().countDocuments()

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
ProductReviewSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchQuery = {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { status: { $regex: keyword, $options: 'i' } }
    ]
  }
  const productReviews = await ProductReview()
    .find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('images')

  const total = await Product().countDocuments(searchQuery)
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
  const productReview = await ProductReview().updateOne({ _id: reviewId }, {
    ...productReviewDetails,
    updated_at: Date.now()
  })
  return productReview
}

// Delete product review
ProductReviewSchema.statics.deleteProductReview = async (reviewId, productId) => {
  await Product().updateOne({ _id: productId }, {
    $pull: {
      custom_fields: reviewId
    },
    updated_at: Date.now()
  })
  const productReview = await ProductReview().deleteOne({ _id: reviewId })
  return productReview
}

const ProductReview = function () {
  return tenantModel('ProductReview', ProductReviewSchema)
}
module.exports = ProductReview
