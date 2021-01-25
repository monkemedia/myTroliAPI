const mongoose = require('mongoose')
const ProductOptionSchema = require('./schema')

// Get all product options
ProductOptionSchema.statics.findProductOptions = async (productId) => {
  const productOptions = await ProductOption.find({ product_id: productId })

  return productOptions
}

// Get a product option
ProductOptionSchema.statics.findProductOption = async (productId, optionId) => {
  const productOptions = await ProductOption.findOne({ product_id: productId, _id: optionId })

  return productOptions
}

// Update product option
ProductOptionSchema.statics.updateProductOption = async (productId, optionId, data) => {
  const productOptions = await ProductOption.updateOne({
    _id: optionId,
    product_id: productId
  }, {
    ...data,
    updated_at: Date.now()
  })
  return productOptions
}

// Delete product option
ProductOptionSchema.statics.deleteProductOption = async (productId, optionId) => {
  const productOptions = await ProductOption.deleteOne({ product_id: productId, _id: optionId })
  return productOptions
}

const ProductOption = mongoose.model('ProductOption', ProductOptionSchema)

module.exports = ProductOption
