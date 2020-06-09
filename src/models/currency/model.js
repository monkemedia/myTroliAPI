const mongoose = require('mongoose')
const currencySchema = require('./schema')

// Get currencies
currencySchema.statics.findCurrencies = async () => {
  const currencies = await Currency.find({})

  return currencies
}

// Update currency
currencySchema.statics.updateCurrency = async (currencyId, currencyDetails) => {
  const currency = await Currency.updateOne({ _id: currencyId }, currencyDetails)
  return currency
}

// Delete currency
currencySchema.statics.deleteCurrency = async (currencyId) => {
  const currency = await Currency.deleteOne({ _id: currencyId })
  return currency
}

const Currency = mongoose.model('Currency', currencySchema)

module.exports = Currency
