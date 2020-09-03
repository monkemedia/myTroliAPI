const mongoose = require('mongoose')
const CountrySchema = require('./schema')

// Get countries
CountrySchema.statics.findCountries = async () => {
  const countries = await Country.find({})

  return countries
}

const Country = mongoose.model('Country', CountrySchema)

module.exports = Country
