const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productCategoryRelationshipSchema = require('./schema')

productCategoryRelationshipSchema.plugin(uniqueArrayPlugin)

// Get all Categories
// productCategoryRelationshipSchema.statics.findAllCategories = async () => {
//   const categories = await Category.find({})

//   return categories
// }

// Find category by id
productCategoryRelationshipSchema.statics.findCategory = async (id) => {
  const category = await Category.findOne({ _id: id })
  return category
}

// Delete category
productCategoryRelationshipSchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category.deleteOne({ _id: categoryId })
  return category
}

// Update category
productCategoryRelationshipSchema.statics.updateCategory = async ({ _id, data }) => {
  const category = await Category.updateOne({ _id }, { data })
  return category
}

const Category = mongoose.model('ProductCategoryRelationship', productCategoryRelationshipSchema)

module.exports = Category
