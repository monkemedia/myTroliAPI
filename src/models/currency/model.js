const CurrencySchema = require('./schema')
const { tenantModel } = require('../../utils/multitenancy');

// Get currencies
CurrencySchema.statics.findCurrencies = async () => {
  const currencies = await Currency().find({})

  return currencies
}

// Update currency
CurrencySchema.statics.updateCurrency = async (currencyId, currencyDetails) => {
  const currency = await Currency().updateOne({ _id: currencyId }, currencyDetails)
  return currency
}

// Delete currency
CurrencySchema.statics.deleteCurrency = async (currencyId) => {
  const currency = await Currency().deleteOne({ _id: currencyId })
  return currency
}

const Currency = function () {
  return tenantModel('Currency', CurrencySchema)
}
module.exports = Currency
