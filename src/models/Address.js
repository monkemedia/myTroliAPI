const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
  customer_id: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: false
  },
  line_1: {
    type: String,
    required: true
  },
  line_2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  county: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: false
  },
  instructions: {
    type: String,
    required: false
  },
  default: {
    type: Boolean,
    required: false,
    default: false
  }
})

// Find all addresses by customer id
addressSchema.statics.findAllAddresses = async (customerId) => {
  const addresses = await Address.find({ customer_id: customerId })
  return addresses
}

// Find all addresses by customer id
addressSchema.statics.findAddress = async (addressId) => {
  const addresses = await Address.findOne({ _id: addressId })
  return addresses
}

// Find all addresses by customer id
addressSchema.statics.deleteAddress = async (addressId) => {
  const address = await Address.deleteOne({ _id: addressId })
  return address
}

// Search for a customer by email address
addressSchema.statics.updateAddress = async (addressDetails) => {
  const { _id } = addressDetails
  const address = await Address.updateOne({ _id }, addressDetails)
  return address
}

const Address = mongoose.model('Address', addressSchema)

module.exports = Address
