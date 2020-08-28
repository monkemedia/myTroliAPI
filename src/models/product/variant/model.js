const ProductVariantSchema = require('./schema')
const { tenantModel } = require('../../../utils/multitenancy')

// Get product variants
ProductVariantSchema.statics.findProductVariants = async (productId) => {
  const productVariants = await ProductVariant()
    .aggregate([
      {
        $match: { product_id: productId }
      },
      {
        $sort: { sort_order: 1 }
      },  
      {
        $lookup: {
          from: 'productvariantimages',
          localField: 'images',
          foreignField: '_id',
          as: 'images'
        }
      }
    ])

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
