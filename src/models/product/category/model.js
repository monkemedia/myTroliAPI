const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productCategorySchema = require('./schema')

productCategorySchema.plugin(uniqueArrayPlugin)

// Get all Categories
// productCategorySchema.statics.findAllCategories = async () => {
//   const categories = await Category.find({})

//   return categories
// }

// Find all category relationships by category id
productCategorySchema.statics.findAllByCategoryIds = async (id) => {
  const productCategory = await ProductCategory.find({ 'data.category_id': id })
  return productCategory
}

// Find productCategory by id
productCategorySchema.statics.findCategory = async (id) => {
  const productCategory = await ProductCategory.findOne({ _id: id })
  return productCategory
}

// Delete productCategory
productCategorySchema.statics.deleteCategory = async (categoryId) => {
  const productCategory = await ProductCategory.deleteOne({ _id: categoryId })
  return productCategory
}

// Update productCategory
productCategorySchema.statics.updateCategory = async ({ _id, data }) => {
  const productCategory = await ProductCategory.updateOne({ _id }, { data })
  return productCategory
}

const ProductCategory = mongoose.model('ProductCategories', productCategorySchema)

module.exports = ProductCategory
