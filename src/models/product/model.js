const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const ProductSchema = require('./schema')
const ProductImage = require('./images')
const ProductVariant = require('./variant')
const ProductVariantImage = require('./variant/images')
const ProductOption = require('./option')
const { tenantModel } = require('../../utils/multitenancy');

ProductSchema.plugin(deepPopulate)

// Get all products
ProductSchema.statics.findProducts = async ({ page, limit }) => {
  const products = await Product()
    .aggregate([
      {
        $lookup: {
          from: 'productimages',
          localField: 'images',
          foreignField: '_id',
          as: 'images'
        }
      },
      {
        $lookup: {
          from: 'productvariants',
          localField: 'variants',
          foreignField: '_id',
          as: 'variants'
        }
      },
      {
        $lookup: {
          from: 'productreviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviews_rating_average: { $ifNull: [ { $avg: '$reviews.rating' }, 0 ] },
          reviews_count: { $size: '$reviews' }
        } 
      },
      { $sort: {'created_at' : -1} },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])
  const total = await Product().countDocuments()
  return {
    data: products,
    meta: {
      pagination: {
        current: page,
        total: products.length
      },
      results: {
        total
      }
    }
  }
}

// Search products by Name, SKU or Search Keywords
ProductSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchQuery = {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { sku: { $regex: keyword, $options: 'i' } },
      { search_keywords: { $regex: keyword, $options: 'i' } }
    ]
  }
  const products = await Product()
    .find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('images')
    .deepPopulate('variants.images')

  const total = await Product().countDocuments(searchQuery)
  return {
    data: products,
    meta: {
      pagination: {
        current: page,
        total: products.length
      },
      results: {
        total: total
      }
    }
  }
}

// Get product
ProductSchema.statics.findProduct = async (_id) => {
  const product = await Product()
    .findOne({ _id })
    .populate('images')
    .deepPopulate('variants.images')
  return product
}

// Get product count
ProductSchema.statics.getCount = async (isRatings) => {
  const query = {}

  if (isRatings) {
    Object.assign(query, {
      reviews_count: { $gt : 0 }
    })
  }

  const product = await Product()
    .aggregate([
      {
        $lookup: {
          from: 'productreviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviews_rating_average: { $ifNull: [ { $avg: '$reviews.rating' }, 0 ] },
          reviews_count: { $ifNull: [ { $size: '$reviews' }, 0] }
        } 
      },
      { $match : query },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ])

  return {
    count: product.length > 0 ? product[0].count : 0
  }
}

// Update product
ProductSchema.statics.updateProduct = async (productId, productDetails) => {
  await Product().updateOne({ _id: productId }, {
    ...productDetails,
    updated_at: Date.now()
  })
  const product = await Product()
    .findOne({ _id: productId })
    .populate('images')
    .deepPopulate('variants.images')
  return product
}

// Delete product by id
ProductSchema.statics.deleteProduct = async (productId) => {
  await ProductImage.deleteMany({ product_id: productId })
  await ProductOption.deleteMany({ product_id: productId })
  await ProductVariantImage.deleteMany({ product_id: productId })
  await ProductVariant.deleteMany({ product_id: productId })

  const product = await Product().deleteOne({ _id: productId })
  return product
}

const Product = function () {
  return tenantModel('Product', ProductSchema)
}
module.exports = Product
