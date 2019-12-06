const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productCategoryRelationshipSchema = require('./schema')

productCategoryRelationshipSchema.plugin(uniqueArrayPlugin)

// Get all Categories
// productCategoryRelationshipSchema.statics.findAllCategories = async () => {
//   const categories = await Category.find({})

//   return categories
// }

// Delete category
productCategoryRelationshipSchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category.deleteOne({ category_id: categoryId })
  return category
}

const Category = mongoose.model('ProductCategoryRelationship', productCategoryRelationshipSchema)

module.exports = Category
