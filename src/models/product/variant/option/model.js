const mongoose = require('mongoose')
const productVariantOptionSchema = require('./schema')

// Get all product variants
productVariantOptionSchema.statics.findAllProductVariantOptions = async (variantId) => {
  const productVariantOptions = await ProductVariantOptions.find({ variant_id: variantId })

  return productVariantOptions
}

// Update product variant
productVariantOptionSchema.statics.updateProductVariantOption = async (productVariantOptionDetails) => {
  const { _id } = productVariantOptionDetails

  const productVariantOptions = await ProductVariantOptions.updateOne({ _id }, productVariantOptionDetails)
  return productVariantOptions
}

// Delete product variant
productVariantOptionSchema.statics.deleteProductVariantOption = async (optionId) => {
  const productVariantOptions = await ProductVariantOptions.deleteOne({ _id: optionId })
  return productVariantOptions
}

const ProductVariantOptions = mongoose.model('ProductVariantOptions', productVariantOptionSchema)

module.exports = ProductVariantOptions
