const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productCategorySchema = require('./schema')

productCategorySchema.plugin(uniqueArrayPlugin)

// Find product categories
productCategorySchema.statics.findProductCategories = async (id) => {
  const productCategory = await ProductCategory
    .find({ 'data.category_id': id })
  return productCategory
}

// Find product category
productCategorySchema.statics.findProductCategory = async (productId) => {
  const productCategory = await ProductCategory
    .findOne({ product_id: productId })
  return productCategory
}

// Update product categories
productCategorySchema.statics.updateProductCategory = async (productId, data) => {
  const productCategory = await ProductCategory.updateOne({ product_id: productId }, data)
  return productCategory
}

// Delete product categories
productCategorySchema.statics.deleteProductCategory = async (productId) => {
  const productCategory = await ProductCategory.deleteOne({ product_id: productId })
  return productCategory
}

const ProductCategory = mongoose.model('ProductCategories', productCategorySchema)

module.exports = ProductCategory
