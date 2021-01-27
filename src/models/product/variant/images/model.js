const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const ProductVariantImageSchema = require('./schema')

ProductVariantImageSchema.plugin(uniqueArrayPlugin)

// Get all product variant images
ProductVariantImageSchema.statics.findAllProductVariantImages = async (product_id, variant_id) => {
  const productVariantImages = await ProductVariantImage
    .find({ product_id, variant_id })
  return productVariantImages
}

// Get product variant images by query
ProductVariantImageSchema.statics.findProductVariantImagesByQuery = async (product_id, variant_id, query) => {
  const productVariantImages = await ProductVariantImage
    .find({
      product_id,
      variant_id,
      ...query
    })
  return productVariantImages
}

// Update product variant images
ProductVariantImageSchema.statics.updateProductVariantImage = async (product_id, variant_id, data) => {
  const productVariantImage = await ProductVariantImage
    .updateOne({
    _id: data._id,
    product_id,
    variant_id
  }, data)
  return productVariantImage
}

// Get product variant image
ProductVariantImageSchema.statics.findProductVariantImage = async (product_id, variant_id, imageId) => {
  const productVariantImage = await ProductVariantImage
    .findOne({ product_id, variant_id, _id: imageId })
  return productVariantImage
}

// Delete file
ProductVariantImageSchema.statics.deleteImage = async (id) => {
  const image = await ProductVariantImage.deleteOne({ _id: id })
  return image
}

const ProductVariantImage = mongoose.model('ProductVariantImage', ProductVariantImageSchema)

module.exports = ProductVariantImage
