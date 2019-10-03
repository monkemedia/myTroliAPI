const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')

const productCategoryRelationshipSchema = mongoose.Schema({
  categories: [{
    type: {
      type: String,
      required: true
    },
    category_id: {
      type: String,
      required: true,
      unique: true
    },
    _id: false
  }]
})

productCategoryRelationshipSchema.plugin(uniqueArrayPlugin)

// Get all Categories
productCategoryRelationshipSchema.statics.findAllCategories = async () => {
  const categories = await Category.find({})

  return categories
}

// Update product
productCategoryRelationshipSchema.statics.updateCategory = async (categoryDetails) => {
  const { _id } = categoryDetails

  const category = await Category.updateOne({ _id }, categoryDetails)
  return category
}

// Delete category
productCategoryRelationshipSchema.statics.deleteCategory = async (categoryId) => {
  const category = await Category.deleteOne({ _id: categoryId })
  return category
}

const Category = mongoose.model('ProductCategoryRelationship', productCategoryRelationshipSchema)

module.exports = Category
