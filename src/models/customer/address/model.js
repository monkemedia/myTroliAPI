const mongoose = require('mongoose')
const CustomerAddressSchema = require('./schema')

// Find address
CustomerAddressSchema.statics.findCustomerAddresses = async (customerId) => {
  const addresses = await CustomerAddress.find({ customer_id: customerId })
  return addresses
}

// Find address
CustomerAddressSchema.statics.findCustomerAddress = async (addressId) => {
  const address = await CustomerAddress.findOne({ _id: addressId })
  return address
}

// Update address
CustomerAddressSchema.statics.updateCustomerAddress = async (addressId, addressDetails) => {
  const address = await CustomerAddress.updateOne({ _id: addressId }, {
    ...addressDetails,
    updated_at: Date.now()
  })
  return address
}

// Delete address
CustomerAddressSchema.statics.deleteCustomerAddress = async (addressId) => {
  const address = await CustomerAddress.deleteOne({ _id: addressId })
  return address
}


const CustomerAddress = mongoose.model('CustomerAddress', CustomerAddressSchema)

module.exports = CustomerAddress
