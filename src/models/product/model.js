const mongoose = require('mongoose')
const deepPopulate = require('mongoose-deep-populate')(mongoose)
const productSchema = require('./schema')

productSchema.plugin(deepPopulate)

// Get all products
productSchema.statics.findProducts = async ({ page, limit }) => {
  const products = await Product
    .find({})
    .sort('-created_at')
    .populate('images')
    .deepPopulate('variants.images')
    .skip((page - 1) * limit)
    .limit(limit)
  const total = await Product.countDocuments()
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

// Search products by Name or SKU
productSchema.statics.search = async ({ page, limit, keyword }) => {
  const searchQuery = {
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { sku: { $regex: keyword, $options: 'i' } }
    ]
  }
  const products = await Product
    .find(searchQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('images')
    .deepPopulate('variants.images')

  const total = await Product.countDocuments(searchQuery)
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
productSchema.statics.findProduct = async (_id) => {
  const product = await Product
    .findOne({ _id })
    .populate('images')
    .deepPopulate('variants.images')
  return product
}

// Get product count
productSchema.statics.getCount = async () => {
  const total = await Product.countDocuments()
  return {
    count: total
  }
}

// Update product
productSchema.statics.updateProduct = async (productId, productDetails) => {
  productDetails.updated_at = new Date()
  const data = {
    ...productDetails
  }

  await Product.updateOne({ _id: productId }, data)
  const product = await Product
    .findOne({ _id: productId })
    .populate('images')
    .deepPopulate('variants.images')
  return product
}

// Delete product by id
productSchema.statics.deleteProduct = async (productId) => {
  const product = await Product.deleteOne({ _id: productId })
  return product
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product
