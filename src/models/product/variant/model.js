const mongoose = require('mongoose')
const productVariantSchema = require('./schema')

// Get product variants
productVariantSchema.statics.findProductVariants = async (productId) => {
  const productVariants = await ProductVariants
    .find({ product_id: productId })
    .sort({ sort_order: 1 })
    .populate('images')

  return productVariants
}

// Update product variant
productVariantSchema.statics.updateProductVariant = async (variantId, productVariantDetails) => {
  const productVariant = await ProductVariants.updateOne({ _id: variantId }, {
    ...productVariantDetails,
    updated_at: Date.now()
  })
  return productVariant
}

// Delete product variant
productVariantSchema.statics.deleteProductVariant = async (variantId) => {
  const productVariant = await ProductVariants.deleteOne({ _id: variantId })
  return productVariant
}

const ProductVariants = mongoose.model('ProductVariants', productVariantSchema)

module.exports = ProductVariants
