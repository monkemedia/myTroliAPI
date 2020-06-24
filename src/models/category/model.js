const mongoose = require('mongoose')
const categorySchema = require('./schema')

// Get categories
categorySchema.statics.findCategories = async ({ page, limit }) => {
  const categories = await Category
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Category.countDocuments()
  return {
    data: categories,
    meta: {
      pagination: {
        current: page,
        total: categories.length
      },
      results: {
        total
      }
    }
  }
}

// Search categories by name
categorySchema.statics.search = async ({ page, limit, query }) => {
  const searchArray = [
    { name: { $regex: query, $options: 'i' } },
    { slug: { $regex: query, $options: 'i' } }
  ]
  const categories = await Category
    .find()
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Category.countDocuments(searchArray)
  return {
    data: categories,
    meta: {
      pagination: {
        current: page,
        total: categories.length
      },
      results: {
        total: total
      }
    }
  }
}

// Get product count
categorySchema.statics.getCount = async () => {
  const total = await Category.countDocuments()
  return {
    count: total
  }
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
