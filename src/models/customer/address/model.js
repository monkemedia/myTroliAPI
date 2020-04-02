const mongoose = require('mongoose')
const customerAddressSchema = require('./schema')

// Find address
customerAddressSchema.statics.findCustomerAddresses = async (customerId) => {
  const addresses = await CustomerAddress.find({ customer_id: customerId })
  return addresses
}

// Find address
customerAddressSchema.statics.findCustomerAddress = async (addressId) => {
  const address = await CustomerAddress.findOne({ _id: addressId })
  return address
}

// Update address
customerAddressSchema.statics.updateCustomerAddress = async (addressId, addressDetails) => {
  const address = await CustomerAddress.updateOne({ _id: addressId }, addressDetails)
  return address
}

// Delete address
customerAddressSchema.statics.deleteCustomerAddress = async (addressId) => {
  const address = await CustomerAddress.deleteOne({ _id: addressId })
  return address
}

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema)

module.exports = CustomerAddress
