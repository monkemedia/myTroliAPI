const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: Object,
    required: false
  }
})

// Get all Categories
categorySchema.statics.findAllCategories = async () => {
  const categories = await Category.find({})

  return categories
}

// Update product
categorySchema.statics.updateCategory = async (categoryDetails) => {
  const { _id } = categoryDetails

  const category = await Category.updateOne({ _id }, categoryDetails)
  return category
}

// Delete category
categorySchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category.deleteOne({ _id: categoryId })
  return category
}

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
