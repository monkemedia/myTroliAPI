const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productCategorySchema = require('./schema')

productCategorySchema.plugin(uniqueArrayPlugin)

// Find all Product Categories
productCategorySchema.statics.findAllProductCategories = async (productId) => {
  const productCategories = await ProductCategory.find({ product_id: productId })
  return productCategories
}

// Find Product Category
productCategorySchema.statics.findProductCategory = async (id) => {
  const productCategory = await ProductCategory.findOne({ _id: id })
  return productCategory
}

// Update Product Categories
productCategorySchema.statics.updateProductCategory = async (productId, data) => {
  const productCategory = await ProductCategory.updateOne({ product_id: productId }, data)
  return productCategory
}

// Delete Product Categories
productCategorySchema.statics.deleteProductCategory = async (productId) => {
  const productCategory = await ProductCategory.deleteOne({ product_id: productId })
  return productCategory
}

const ProductCategory = mongoose.model('ProductCategories', productCategorySchema)

module.exports = ProductCategory
