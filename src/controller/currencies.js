const Currency = require('../models/currency')

const createCurrencies = async (req, res) => {
  const data = req.body

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'currency')) {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  if (data.some(val => !val.name)) {
    return res.status(401).send({
      message: 'Name is required'
    })
  }

  if (data.some(val => !val.currency_code)) {
    return res.status(401).send({
      message: 'Currency code is required'
    })
  }

  if (data.some(val => !val.currency_symbol)) {
    return res.status(401).send({
      message: 'Currency symbol is required'
    })
  }

  try {
    const promise = data.map(async obj => {
      const currency = new Currency()(obj)
      const save = await currency.save()
      return save
    })
    const savedCurrencies = await Promise.all(promise)

    res.status(201).send(savedCurrencies)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCurrencies = async (req, res) => {
  try {
    const currencies = await Currency().findCurrencies()

    res.status(200).send(currencies)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCurrency = async (req, res) => {
  const currencyId = req.params.currencyId
  const currency = await Currency().findOne({ _id: currencyId })

  res.status(200).send(currency)
}

const updateCurrency = async (req, res) => {
  const currencyId = req.params.currencyId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'currency') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await Currency().updateCurrency(currencyId, data)
    const currency = await Currency().findOne({ _id: currencyId })

    res.status(200).send(currency)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCurrency = async (req, res) => {
  try {
    const currencyId = req.params.currencyId

    await Currency().deleteCurrency(currencyId)

    res.status(200).send({
      message: 'Currency successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCurrencies,
  getCurrencies,
  getCurrency,
  updateCurrency,
  deleteCurrency
}
