const mongoose = require('mongoose')
const ShippingMethodSchema = require('./schema')

// Get methods
ShippingMethodSchema.statics.findMethods = async (store_hash) => {
  const methods = await ShippingMethod.find({ store_hash })
  return methods
}

// Get method
ShippingMethodSchema.statics.findMethod = async (methodId) => {
  const method = await ShippingMethod.findOne({ _id: methodId })
  return method
}

// Update method
ShippingMethodSchema.statics.updateMethod = async (methodId, methodDetails) => {
  const method = await ShippingMethod.updateOne({ _id: methodId }, {
    ...methodDetails,
    updated_at: Date.now()
  })
  return method
}

// Delete method
ShippingMethodSchema.statics.deleteMethod = async (methodId) => {
  const method = await ShippingMethod.deleteOne({ _id: methodId })
  return method
}

const ShippingMethod = mongoose.model('ShippingMethod', ShippingMethodSchema)

module.exports = ShippingMethod
