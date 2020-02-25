const mongoose = require('mongoose')
const productCategorySchema = require('./schema')

// Find all product categories
productCategorySchema.statics.findAllProductCategories = async (productId) => {
  const productCategory = await ProductCategory.find({ product_id: productId })
  return productCategory
}

// Find category by id
// productCategorySchema.statics.findProductCategory = async (id) => {
//   const category = await ProductCategory.findOne({ _id: id })
//   return category
// }

// Update product category
productCategorySchema.statics.updateProductCategory = async (productCategoryDetails) => {
  const { _id } = productCategoryDetails
  const productCategory = await ProductCategory.updateOne({ _id }, productCategoryDetails)
  return productCategory
}

// Delete product category
productCategorySchema.statics.deleteProductCategory = async (categoryId) => {
  const productCategory = await ProductCategory.deleteOne({ _id: categoryId })
  return productCategory
}

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema)

module.exports = ProductCategory
