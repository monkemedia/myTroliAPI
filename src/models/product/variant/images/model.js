const uniqueArrayPlugin = require('mongoose-unique-array')
const ProductVariantImageSchema = require('./schema')
const { tenantModel } = require('../../../../utils/multitenancy')

ProductVariantImageSchema.plugin(uniqueArrayPlugin)

// Get all product variant images
ProductVariantImageSchema.statics.findAllProductVariantImages = async (productId, variantId) => {
  const productVariantImages = await ProductVariantImage()
    .find({ product_id: productId, variant_id: variantId })
  return productVariantImages
}

// Get product variant images by query
ProductVariantImageSchema.statics.findProductVariantImagesByQuery = async (productId, variantId, query) => {
  const productVariantImages = await ProductVariantImage()
    .find({
      product_id: productId,
      variant_id: variantId,
      ...query
    })
  return productVariantImages
}

// Update product variant images
ProductVariantImageSchema.statics.updateProductVariantImage = async (productId, variantId, data) => {
  const productVariantImage = await ProductVariantImage()
    .updateOne({
    _id: data._id,
    product_id: productId,
    variant_id: variantId
  }, data)
  return productVariantImage
}

// Get product variant image
ProductVariantImageSchema.statics.findProductVariantImage = async (productId, variantId, imageId) => {
  const productVariantImage = await ProductVariantImage()
    .findOne({ product_id: productId, variant_id: variantId, _id: imageId })
  return productVariantImage
}

// Delete file
ProductVariantImageSchema.statics.deleteImage = async (id) => {
  const image = await ProductVariantImage().deleteOne({ _id: id })
  return image
}

const ProductVariantImage = function () {
  return tenantModel('ProductVariantImage', ProductVariantImageSchema)
}
module.exports = ProductVariantImage
