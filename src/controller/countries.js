const Country = require('../models/country')

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

module.exports = {
  getCountries,
  getCountry
}
