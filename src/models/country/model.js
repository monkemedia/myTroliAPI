const mongoose = require('mongoose')
const countrySchema = require('./schema')

// Get countries
countrySchema.statics.findCountries = async () => {
  const countries = await Country.find({})

  return countries
}

// Update country
countrySchema.statics.updateCountry = async (countryId, countryDetails) => {
  const country = await Country.updateOne({ _id: countryId }, countryDetails)
  return country
}

// Delete country
countrySchema.statics.deleteCountry = async (countryId) => {
  const country = await Country.deleteOne({ _id: countryId })
  return country
}

const Country = mongoose.model('Country', countrySchema)

module.exports = Country
