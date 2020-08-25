const ProductVariantSchema = require('./schema')
const { tenantModel } = require('../../../utils/multitenancy');

// Get product variants
ProductVariantSchema.statics.findProductVariants = async (productId) => {
  const productVariants = await ProductVariant()
    .find({ product_id: productId })
    .sort({ sort_order: 1 })
    .populate('images')

  return productVariants
}

// Update product variant
ProductVariantSchema.statics.updateProductVariant = async (variantId, productVariantDetails) => {
  const productVariant = await ProductVariant().updateOne({ _id: variantId }, {
    ...productVariantDetails,
    updated_at: Date.now()
  })
  return productVariant
}

// Delete product variant
ProductVariantSchema.statics.deleteProductVariant = async (variantId) => {
  const productVariant = await ProductVariant().deleteOne({ _id: variantId })
  return productVariant
}

const ProductVariant = function () {
  return tenantModel('ProductVariant', ProductVariantSchema)
}
module.exports = ProductVariant
