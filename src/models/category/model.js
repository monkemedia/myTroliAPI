
const mongoose = require('mongoose')
const CategorySchema = require('./schema')

// Get categories
CategorySchema.statics.findCategories = async ({ page, limit, store_hash }) => {
  const categories = await Category
    .find({ store_hash })
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Category.countDocuments({ store_hash })
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
CategorySchema.statics.search = async ({ page, limit, keyword, store_hash }) => {
  const searchArray = [
    { name: { $regex: keyword, $options: 'i' } },
    { slug: { $regex: keyword, $options: 'i' } }
  ]
  const categories = await Category
    .find({ store_hash })
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Category.find({ store_hash }).countDocuments(searchArray)
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

// Get category count
CategorySchema.statics.getCount = async (store_hash) => {
  const total = await Category.countDocuments({ store_hash })
  return {
    count: total
  }
}

// Update category
CategorySchema.statics.updateCategory = async (categoryId, categoryDetails) => {
  const category = await Category.updateOne({ _id: categoryId }, categoryDetails)
  return category
}

// Delete category
CategorySchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category.deleteOne({ _id: categoryId })
  return category
}

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category
