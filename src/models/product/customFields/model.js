const mongoose = require('mongoose')
const ProductCustomFieldSchema = require('./schema')
const Product = require('../model')

// Get product custom fields
ProductCustomFieldSchema.statics.findProductCustomFields = async (product_id) => {
  const productCustomFields = await ProductCustomField
    .find({ product_id })
    .sort({ sort_order: 1 })

  return productCustomFields
}

// Update product custome field
ProductCustomFieldSchema.statics.updateProductCustomField = async (customFieldId, productCustomFieldDetails) => {
  const productCustomField = await ProductCustomField.updateOne({ _id: customFieldId }, {
    ...productCustomFieldDetails,
    updated_at: Date.now()
  })
  return productCustomField
}

// Delete product custome field
ProductCustomFieldSchema.statics.deleteProductCustomField = async (customFieldId, productId) => {
  await Product.updateOne({ _id: productId }, {
    $pull: {
      custom_fields: customFieldId
    },
    updated_at: Date.now()
  })
  const productCustomField = await ProductCustomField.deleteOne({ _id: customFieldId })
  return productCustomField
}

const ProductCustomField = mongoose.model('ProductCustomField', ProductCustomFieldSchema)

module.exports = ProductCustomField
