const mongoose = require('mongoose')
const shippingMethodSchema = require('./schema')

// Get methods
shippingMethodSchema.statics.findMethods = async () => {
  const methods = await ShippingMethods.find({})
  return methods
}

// Get method
shippingMethodSchema.statics.findMethod = async (methodId) => {
  const method = await ShippingMethods.findOne({ _id: methodId })
  return method
}

// Update method
shippingMethodSchema.statics.updateMethod = async (methodId, methodDetails) => {
  const method = await ShippingMethods.updateOne({ _id: methodId }, methodDetails)
  return method
}

// Delete method
shippingMethodSchema.statics.deleteMethod = async (methodId) => {
  const method = await ShippingMethods.deleteOne({ _id: methodId })
  return method
}

const ShippingMethods = mongoose.model('ShippingMethods', shippingMethodSchema)

module.exports = ShippingMethods
