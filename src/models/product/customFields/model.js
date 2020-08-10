const mongoose = require('mongoose')
const productCustomFieldSchema = require('./schema')
const Product = require('../model')

// Get product custom fields
productCustomFieldSchema.statics.findProductCustomFields = async (productId) => {
  const productCustomFields = await ProductCustomFields
    .find({ product_id: productId })
    .sort({ sort_order: 1 })

  return productCustomFields
}

// Update product custome field
productCustomFieldSchema.statics.updateProductCustomField = async (customFieldId, productCustomFieldDetails) => {
  const productCustomField = await ProductCustomFields.updateOne({ _id: customFieldId }, {
    ...productCustomFieldDetails,
    updated_at: Date.now()
  })
  return productCustomField
}

// Delete product custome field
productCustomFieldSchema.statics.deleteProductCustomField = async (customFieldId, productId) => {
  await Product.updateOne({ _id: productId }, {
    $pull: {
      custom_fields: customFieldId
    },
    updated_at: Date.now()
  })
  const productCustomField = await ProductCustomFields.deleteOne({ _id: customFieldId })
  return productCustomField
}

const ProductCustomFields = mongoose.model('ProductCustomFields', productCustomFieldSchema)

module.exports = ProductCustomFields
