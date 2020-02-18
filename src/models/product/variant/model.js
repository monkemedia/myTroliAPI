const mongoose = require('mongoose')
const productVariantSchema = require('./schema')

// Get all product variants
productVariantSchema.statics.findAllProductVariants = async () => {
  const productVariants = await ProductVariants.find({}).populate('options')

  return productVariants
}

// Update product variant
productVariantSchema.statics.updateProductVariant = async (productVariantDetails) => {
  const { _id } = productVariantDetails

  const productVariant = await ProductVariants.updateOne({ _id }, productVariantDetails)
  return productVariant
}

// Delete product variant
productVariantSchema.statics.deleteProductVariant = async (variantId) => {
  const productVariant = await ProductVariants.deleteOne({ _id: variantId })
  return productVariant
}

const ProductVariants = mongoose.model('ProductVariants', productVariantSchema)

module.exports = ProductVariants
