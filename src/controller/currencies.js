const Currency = require('../models/currency')

const getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findCurrencies()

    res.status(200).send(currencies)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCurrency = async (req, res) => {
  const currencyId = req.params.currencyId
  const currency = await Currency.findOne({ _id: currencyId })

  res.status(200).send(currency)
}

module.exports = {
  getCurrencies,
  getCurrency
}
