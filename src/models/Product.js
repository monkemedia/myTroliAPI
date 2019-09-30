const mongoose = require('mongoose')
const currencySymbol = require('currency-symbol-map')

const productSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Array,
    required: true
  },
  commodity_type: {
    type: String,
    required: true
  },
  meta: {
    type: Object,
    required: false
  }
})

// Add meta data before saving
productSchema.pre('save', async function (next) {
  const product = this
  const amount = product.price[0].amount
  const currency = product.price[0].currency
  const stock = product.stock

  function formatCurrency () {
    return currencySymbol(currency) + amount.toFixed(2).toString()
  }

  product.meta = {
    display_price: {
      currency,
      formatted: formatCurrency()
    },
    stock: {
      level: product.stock,
      availability: stock === 0 ? 'out-stock' : 'in-stock'
    }
  }
  next()
})

// // Find all addresses by customer id
// addressSchema.statics.findAllAddresses = async (customerId) => {
//   const addresses = await Address.find({ customer_id: customerId })
//   return addresses
// }

// // Find all addresses by customer id
// addressSchema.statics.findAddress = async (addressId) => {
//   const addresses = await Address.findOne({ _id: addressId })
//   return addresses
// }

// // Find all addresses by customer id
// addressSchema.statics.deleteAddress = async (addressId) => {
//   const address = await Address.deleteOne({ _id: addressId })
//   return address
// }

// // Search for a customer by email address
// addressSchema.statics.updateAddress = async (addressDetails) => {
//   const { _id } = addressDetails
//   const address = await Address.updateOne({ _id }, addressDetails)
//   return address
// }

const Product = mongoose.model('Product', productSchema)

module.exports = Product
