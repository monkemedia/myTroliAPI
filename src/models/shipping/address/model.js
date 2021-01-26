const mongoose = require('mongoose')
const ShippingAddressSchema = require('./schema')

// Update shipping address
ShippingAddressSchema.statics.updateShippingAddress = async (data, store_hash) => {
  const shippingAddress = await ShippingAddress.updateOne({ store_hash }, {
    ...data,
    updated_at: Date.now()
  })
  return shippingAddress
}

// Delete shipping address
ShippingAddressSchema.statics.deleteShippingAddress = async (store_hash) => {
  const shippingAddress = await ShippingAddress.deleteOne({ store_hash })
  return shippingAddress
}

const ShippingAddress = mongoose.model('ShippingAddress', ShippingAddressSchema)

module.exports = ShippingAddress
