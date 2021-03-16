const mongoose = require('mongoose')
const CustomerAddressSchema = require('./schema')
const { convertISOToCountry} = require('../../../utils/helpers')

// Convert country code to string
CustomerAddressSchema.pre('save', async function (next) {
  const address = this

  address.country = await convertISOToCountry(address.country_code)
  next()
})

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
  addressDetails.country = await convertISOToCountry(addressDetails.country_code)
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
