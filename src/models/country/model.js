const CountrySchema = require('./schema')
const { tenantModel } = require('../../utils/multitenancy');

// Get countries
CountrySchema.statics.findCountries = async () => {
  const countries = await Country().find({})

  return countries
}

// Update country
CountrySchema.statics.updateCountry = async (countryId, countryDetails) => {
  const country = await Country().updateOne({ _id: countryId }, countryDetails)
  return country
}

// Delete country
CountrySchema.statics.deleteCountry = async (countryId) => {
  const country = await Country().deleteOne({ _id: countryId })
  return country
}

const Country = function () {
  return tenantModel('Country', CountrySchema)
}
module.exports = Country
