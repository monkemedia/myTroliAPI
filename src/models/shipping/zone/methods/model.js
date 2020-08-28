const ShippingMethodSchema = require('./schema')
const { tenantModel } = require('../../../../utils/multitenancy')

// Get methods
ShippingMethodSchema.statics.findMethods = async () => {
  const methods = await ShippingMethods().find({})
  return methods
}

// Get method
ShippingMethodSchema.statics.findMethod = async (methodId) => {
  const method = await ShippingMethods().findOne({ _id: methodId })
  return method
}

// Update method
ShippingMethodSchema.statics.updateMethod = async (methodId, methodDetails) => {
  const method = await ShippingMethods().updateOne({ _id: methodId }, {
    ...methodDetails,
    updated_at: Date.now()
  })
  return method
}

// Delete method
ShippingMethodSchema.statics.deleteMethod = async (methodId) => {
  const method = await ShippingMethods().deleteOne({ _id: methodId })
  return method
}

const ShippingMethod = function () {
  return tenantModel('ShippingMethod', ShippingMethodSchema)
}
module.exports = ShippingMethod
