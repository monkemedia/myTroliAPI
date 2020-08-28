
const CategorySchema = require('./schema')
const { tenantModel } = require('../../utils/multitenancy')

// Get categories
CategorySchema.statics.findCategories = async ({ page, limit }) => {
  const categories = await Category()
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Category().countDocuments()
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
CategorySchema.statics.search = async ({ page, limit, keyword }) => {
  const searchArray = [
    { name: { $regex: keyword, $options: 'i' } },
    { slug: { $regex: keyword, $options: 'i' } }
  ]
  const categories = await Category()
    .find()
    .or(searchArray)
    .skip((page - 1) * limit)
    .limit(limit)

  const total = await Category().countDocuments(searchArray)
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
CategorySchema.statics.getCount = async () => {
  const total = await Category().countDocuments()
  return {
    count: total
  }
}

// Update category
CategorySchema.statics.updateCategory = async (categoryId, categoryDetails) => {
  const category = await Category().updateOne({ _id: categoryId }, categoryDetails)
  return category
}

// Delete category
CategorySchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category().deleteOne({ _id: categoryId })
  return category
}

const Category = function () {
  return tenantModel('Category', CategorySchema)
}
module.exports = Category
