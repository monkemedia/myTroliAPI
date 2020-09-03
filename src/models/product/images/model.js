const uniqueArrayPlugin = require('mongoose-unique-array')
const ProductImageSchema = require('./schema')
const { tenantModel } = require('../../../utils/multitenancy')

ProductImageSchema.plugin(uniqueArrayPlugin)

// Get all product images
ProductImageSchema.statics.findAllProductImages = async (productId) => {
  const productImages = await ProductImage().find({ product_id: productId })
  return productImages
}

// Get product images by query
ProductImageSchema.statics.findProductImagesByQuery = async (productId, query) => {
  const productImages = await ProductImage().find({
    product_id: productId,
    ...query
  })
  return productImages
}

// Get a product image
ProductImageSchema.statics.findProductImage = async (productId, imageId) => {
  const productImage = await ProductImage().findOne({ product_id: productId, _id: imageId })
  return productImage
}

// Update product image
ProductImageSchema.statics.updateProductImage = async (productId, imageId, data) => {
  const productImage = await ProductImage().updateOne({
    _id: imageId,
    product_id: productId
  }, {
    ...data,
    updated_at: Date.now()
  })
  return productImage
}

// Delete file
ProductImageSchema.statics.deleteImage = async (_id) => {
  const image = await ProductImage().deleteOne({ _id })
  return image
}

const ProductImage = function () {
  return tenantModel('ProductImage', ProductImageSchema)
}
module.exports = ProductImage
