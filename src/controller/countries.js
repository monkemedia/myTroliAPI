const Country = require('../models/country/index.js')

const createCountries = async (req, res) => {
  const data = req.body

  if (data.some(val => !val.type)) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (data.some(val => val.type !== 'country')) {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    const promise = data.map(async obj => {
      const country = new Country(obj)
      const save = await country.save()
      return save
    })
    const savedCountries = await Promise.all(promise)

    res.status(201).send(savedCountries)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCountries = async (req, res) => {
  try {
    const countries = await Country.findCountries()

    res.status(200).send(countries)
  } catch (err) {
    res.status(400).send(err)
  }
}

const getCountry = async (req, res) => {
  const countryId = req.params.countryId
  const country = await Country.findOne({ _id: countryId })

  res.status(200).send(country)
}

const updateCountry = async (req, res) => {
  const countryId = req.params.countryId
  const data = req.body
  const { type } = data

  if (!type) {
    return res.status(401).send({
      message: 'Type is required'
    })
  }

  if (type !== 'country') {
    return res.status(401).send({
      message: 'Correct type is required'
    })
  }

  try {
    await Country.updateCountry(countryId, data)
    const country = await Country.findOne({ _id: countryId })

    res.status(200).send(country)
  } catch (err) {
    res.status(400).send(err)
  }
}

const deleteCountry = async (req, res) => {
  try {
    const countryId = req.params.countryId

    await Country.deleteCountry(countryId)

    res.status(200).send({
      message: 'Country successfully deleted'
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  createCountries,
  getCountries,
  getCountry,
  updateCountry,
  deleteCountry
}
