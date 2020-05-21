const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productVariantImageSchema = require('./schema')

productVariantImageSchema.plugin(uniqueArrayPlugin)

// Get all product variant images
productVariantImageSchema.statics.findAllProductVariantImages = async (productId, variantId) => {
  const productVariantImages = await ProductVariantImage
    .find({ product_id: productId, variant_id: variantId })
  return productVariantImages
}

// Get product variant images by query
productVariantImageSchema.statics.findProductVariantImagesByQuery = async (productId, variantId, query) => {
  const productVariantImages = await ProductVariantImage
    .find({
      product_id: productId,
      variant_id: variantId,
      ...query
    })
  return productVariantImages
}

// Update product variant images
productVariantImageSchema.statics.updateProductVariantImage = async (productId, variantId, imageId, data) => {
  const productVariantImage = await ProductVariantImage.updateOne({
    _id: imageId,
    product_id: productId,
    variant_id: variantId
  }, data)
  return productVariantImage
}

// Get product variant image
productVariantImageSchema.statics.findProductVariantImage = async (productId, variantId, imageId) => {
  const productVariantImage = await ProductVariantImage.findOne({ product_id: productId, variant_id: variantId, _id: imageId })
  return productVariantImage
}

// Delete file
productVariantImageSchema.statics.deleteImage = async (_id) => {
  const image = await ProductVariantImage.deleteOne({ _id })
  return image
}

const ProductVariantImage = mongoose.model('ProductVariantImage', productVariantImageSchema)

module.exports = ProductVariantImage
