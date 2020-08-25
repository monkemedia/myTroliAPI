const ProductCustomFieldSchema = require('./schema')
const Product = require('../model')
const { tenantModel } = require('../../../utils/multitenancy');

// Get product custom fields
ProductCustomFieldSchema.statics.findProductCustomFields = async (productId) => {
  const productCustomFields = await ProductCustomField()
    .find({ product_id: productId })
    .sort({ sort_order: 1 })

  return productCustomFields
}

// Update product custome field
ProductCustomFieldSchema.statics.updateProductCustomField = async (customFieldId, productCustomFieldDetails) => {
  const productCustomField = await ProductCustomField().updateOne({ _id: customFieldId }, {
    ...productCustomFieldDetails,
    updated_at: Date.now()
  })
  return productCustomField
}

// Delete product custome field
ProductCustomFieldSchema.statics.deleteProductCustomField = async (customFieldId, productId) => {
  await Product().updateOne({ _id: productId }, {
    $pull: {
      custom_fields: customFieldId
    },
    updated_at: Date.now()
  })
  const productCustomField = await ProductCustomField().deleteOne({ _id: customFieldId })
  return productCustomField
}

const ProductCustomField = function () {
  return tenantModel('ProductCustomField', ProductCustomFieldSchema)
}
module.exports = ProductCustomField
