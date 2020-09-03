const mongoose = require('mongoose')
const CurrencySchema = require('./schema')

// Get currencies
CurrencySchema.statics.findCurrencies = async () => {
  const currencies = await Currency.find({})

  return currencies
}

const Currency = mongoose.model('Currency', CurrencySchema)

module.exports = Currency
