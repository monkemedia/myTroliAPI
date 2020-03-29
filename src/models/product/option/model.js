const mongoose = require('mongoose')
const productOptionSchema = require('./schema')

// Get all product options
productOptionSchema.statics.findProductOptions = async (productId) => {
  const productOptions = await ProductOptions.find({ product_id: productId })

  return productOptions
}

// Get a product option
productOptionSchema.statics.findProductOption = async (productId, optionId) => {
  const productOptions = await ProductOptions.findOne({ product_id: productId, _id: optionId })

  return productOptions
}

// Update product option
productOptionSchema.statics.updateProductOption = async (productId, optionId, data) => {
  const productOptions = await ProductOptions.updateOne({
    _id: optionId,
    product_id: productId
  }, data)
  return productOptions
}

// Delete product option
productOptionSchema.statics.deleteProductOption = async (productId, optionId) => {
  const productOptions = await ProductOptions.deleteOne({ product_id: productId, _id: optionId })
  return productOptions
}

const ProductOptions = mongoose.model('ProductOptions', productOptionSchema)

module.exports = ProductOptions
