const mongoose = require('mongoose')
const addressSchema = require('./schema')

// Find all addresses by customer id
addressSchema.statics.findAllAddresses = async (customerId) => {
  const addresses = await Address.find({ customer_id: customerId })
  return addresses
}

// Find address by address id
addressSchema.statics.findAddress = async (addressId) => {
  const address = await Address.findOne({ _id: addressId })
  return address
}

// Update address
addressSchema.statics.updateAddress = async (addressDetails) => {
  const { _id } = addressDetails
  const address = await Address.updateOne({ _id }, addressDetails)
  return address
}

// Delete address by address id
addressSchema.statics.deleteAddress = async (addressId) => {
  const address = await Address.deleteOne({ _id: addressId })
  return address
}

const Address = mongoose.model('Address', addressSchema)

module.exports = Address
