const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const productImageSchema = require('./schema')

productImageSchema.plugin(uniqueArrayPlugin)

// Get all product images
productImageSchema.statics.findAllProductImages = async (productId) => {
  const productImages = await ProductImage.find({ product_id: productId })
  return productImages
}

// Get product images by query
productImageSchema.statics.findProductImagesByQuery = async (productId, query) => {
  const productImages = await ProductImage.find({
    product_id: productId,
    ...query
  })
  return productImages
}

// Get a product option
productImageSchema.statics.findOption = async (productId, imageId) => {
  const productImage = await ProductImage.findOne({ product_id: productId, _id: imageId })
  return productImage
}

// Update product option
productImageSchema.statics.updateProductImage = async (productId, imageId, data) => {
  const productImage = await ProductImage.updateOne({
    _id: imageId,
    product_id: productId
  }, data)
  return productImage
}

// Delete file
productImageSchema.statics.deleteImage = async (_id) => {
  const image = await ProductImage.deleteOne({ _id })
  return image
}

const ProductImage = mongoose.model('ProductImage', productImageSchema)

module.exports = ProductImage
