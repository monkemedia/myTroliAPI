const mongoose = require('mongoose')
const categorySchema = require('./schema')

// Get Categories
categorySchema.statics.findCategories = async () => {
  const categories = await Category.find({})

  return categories
}

// Update category
categorySchema.statics.updateCategory = async (categoryId, categoryDetails) => {
  const category = await Category.updateOne({ _id: categoryId }, categoryDetails)
  return category
}

// Delete category
categorySchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category.deleteOne({ _id: categoryId })
  return category
}

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
