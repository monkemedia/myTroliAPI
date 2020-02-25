const mongoose = require('mongoose')
const productCategorySchema = require('./schema')

// Find all product categories
productCategorySchema.statics.findAllProductCategories = async (productId) => {
  const productCategory = await ProductCategories.find({ product_id: productId }).populate('name', 'name')
  return productCategory
}

// Update product category
productCategorySchema.statics.updateProductCategory = async (productCategoryDetails) => {
  const { _id } = productCategoryDetails
  const productCategory = await ProductCategories.updateOne({ _id }, productCategoryDetails)
  return productCategory
}

// Delete product category
productCategorySchema.statics.deleteProductCategory = async (categoryId) => {
  const productCategory = await ProductCategories.deleteOne({ _id: categoryId })
  return productCategory
}

const ProductCategories = mongoose.model('ProductCategories', productCategorySchema)

module.exports = ProductCategories
