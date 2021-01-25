const mongoose = require('mongoose')
const ShippingAddressSchema = require('./schema')

// Update shipping address
ShippingAddressSchema.statics.updateShippingAddress = async (data) => {
  const shippingAddress = await ShippingAddress.updateOne({
    ...data,
    updated_at: Date.now()
  })
  return shippingAddress
}

// Delete shipping address
ShippingAddressSchema.statics.deleteShippingAddress = async () => {
  const shippingAddress = await ShippingAddress.deleteOne()
  return shippingAddress
}

const ShippingAddress = mongoose.model('ShippingAddress', ShippingAddressSchema)

module.exports = ShippingAddress
