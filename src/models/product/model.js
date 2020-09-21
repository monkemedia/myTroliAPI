const mongoose = require('mongoose')
const ProductSchema = require('./schema')
const ProductImage = require('./images')
const ProductVariant = require('./variant')
const ProductVariantImage = require('./variant/images')
const ProductOption = require('./option')
const { tenantModel } = require('../../utils/multitenancy')

// Get all products
ProductSchema.statics.findProducts = async ({ page, limit }) => {
  const product = new Product()
  const products = await product
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
  const total = await product.countDocuments()
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
  const product = new Product()
  const products = await product
    .aggregate([
      {
        $match: searchQuery
      },
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

  const total = await product.countDocuments(searchQuery)
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
ProductSchema.statics.findProduct = async (id) => {
  const product = await Product()
    .aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(id) }
      },
      {
        $limit: 1
      },  
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
      }
    ])
  return product[0]
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
ProductSchema.statics.updateProduct = async (id, productDetails) => {
  const product = new Product()
  await product.updateOne({ _id: id }, {
    ...productDetails,
    updated_at: Date.now()
  })
  const productResp = await product
    .aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(id) }
      },
      {
        $limit: 1
      },  
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
      }
    ])
  return productResp[0]
}

// Delete product by id
ProductSchema.statics.deleteProduct = async (productId) => {
  await ProductImage().deleteMany({ product_id: productId })
  await ProductOption().deleteMany({ product_id: productId })
  await ProductVariantImage().deleteMany({ product_id: productId })
  await ProductVariant().deleteMany({ product_id: productId })

  const product = await Product().deleteOne({ _id: productId })
  return product
}

const Product = function () {
  return tenantModel('Product', ProductSchema)
}
module.exports = Product
