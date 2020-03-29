const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productCategorySchema = require('./schema')

productCategorySchema.plugin(uniqueArrayPlugin)

// Find product category
productCategorySchema.statics.findProductCategories = async (id) => {
  const productCategory = await ProductCategory.find({ 'data.category_id': id })
  return productCategory
}

// Find product category
productCategorySchema.statics.findProductCategory = async (id) => {
  const productCategory = await ProductCategory.findOne({ _id: id })
  return productCategory
}

// Delete productCategory
productCategorySchema.statics.deleteProductCategory = async (categoryId) => {
  const productCategory = await ProductCategory.deleteOne({ _id: categoryId })
  return productCategory
}

// Update productCategory
productCategorySchema.statics.updateProductCategory = async ({ _id, data }) => {
  const productCategory = await ProductCategory.updateOne({ _id }, { data })
  return productCategory
}

const ProductCategory = mongoose.model('ProductCategories', productCategorySchema)

module.exports = ProductCategory
