const mongoose = require('mongoose')
const shippingAddressSchema = require('./schema')

// Update shipping address
shippingAddressSchema.statics.updateShippingAddress = async (data) => {
  const shippingAddress = await ShippingAddress.updateOne({
    ...data,
    updated_at: Date.now()
  })
  return shippingAddress
}

// Delete shipping address
shippingAddressSchema.statics.deleteShippingAddress = async () => {
  const shippingAddress = await ShippingAddress.deleteOne()
  return shippingAddress
}

const ShippingAddress = mongoose.model('ShippingAddress', shippingAddressSchema)

module.exports = ShippingAddress
