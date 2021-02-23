const mongoose = require('mongoose')
const CustomerAddressSchema = require('./schema')
const Country = require('../../country')

// Convert country code to string
CustomerAddressSchema.pre('save', async function (next) {
  const address = this
  const countryCode = address.country_code
  const countries = await Country.findCountries()

  address.country = countries.find(country => country.country_iso === countryCode).country
  console.log('address', address)
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
