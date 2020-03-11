const mongoose = require('mongoose')
const productOptionSchema = require('./schema')

// Get all product options
productOptionSchema.statics.findAllProductOptions = async (productId) => {
  const productOptions = await ProductOptions.find({ product_id: productId })

  return productOptions
}

// Get a product option
productOptionSchema.statics.findOption = async (productId, optionId) => {
  const productOptions = await ProductOptions.findOne({ product_id: productId, _id: optionId })

  return productOptions
}

// Update product option
productOptionSchema.statics.updateProductOption = async (productOptionDetails) => {
  const { _id, product_id } = productOptionDetails

  const productOptions = await ProductOptions.updateOne({ _id, product_id }, productOptionDetails)
  return productOptions
}

// Delete product option
productOptionSchema.statics.deleteProductOption = async (productId, optionId) => {
  const productOptions = await ProductOptions.deleteOne({ product_id: productId, _id: optionId })
  return productOptions
}

const ProductOptions = mongoose.model('ProductOptions', productOptionSchema)

module.exports = ProductOptions
