const mongoose = require('mongoose')
const uniqueArrayPlugin = require('mongoose-unique-array')
const ProductImageSchema = require('./schema')

ProductImageSchema.plugin(uniqueArrayPlugin)

// Get all product images
ProductImageSchema.statics.findAllProductImages = async (product_id) => {
  const productImages = await ProductImage.find({ product_id })
  return productImages
}

// Get product images by query
ProductImageSchema.statics.findProductImagesByQuery = async (product_id, query) => {
  const productImages = await ProductImage.find({
    product_id,
    ...query
  })
  return productImages
}

// Get a product image
ProductImageSchema.statics.findProductImage = async (product_id, imageId) => {
  const productImage = await ProductImage.findOne({ product_id, _id: imageId })
  return productImage
}

// Update product image
ProductImageSchema.statics.updateProductImage = async (product_id, imageId, data) => {
  const productImage = await ProductImage.updateOne({
    _id: imageId,
    product_id
  }, {
    ...data,
    updated_at: Date.now()
  })
  return productImage
}

// Delete file
ProductImageSchema.statics.deleteImage = async (_id) => {
  const image = await ProductImage.deleteOne({ _id })
  return image
}

const ProductImage = mongoose.model('ProductImage', ProductImageSchema)

module.exports = ProductImage
