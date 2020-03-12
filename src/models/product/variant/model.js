const mongoose = require('mongoose')
const productVariantSchema = require('./schema')

// Get all product variants
productVariantSchema.statics.findAllProductVariants = async (productId) => {
  const productVariants = await ProductVariants.find({ product_id: productId }) // .populate('name', 'value')

  return productVariants
}

// Update product variant
productVariantSchema.statics.updateProductVariant = async (variantId, productVariantDetails) => {
  const productVariant = await ProductVariants.updateOne({ _id: variantId }, productVariantDetails)
  return productVariant
}

// Delete product variant
productVariantSchema.statics.deleteProductVariant = async (variantId) => {
  const productVariant = await ProductVariants.deleteOne({ _id: variantId })
  return productVariant
}

const ProductVariants = mongoose.model('ProductVariants', productVariantSchema)

module.exports = ProductVariants
