const Countries = require('../models/country')

const getPercentChange = (current, previous) => {  
  return Math.round((((current - previous) / previous) * 100)) // .toFixed(2))
}

const convertISOToCountry = async (iso) => {
  if (!iso) {
    return ''
  }
  console.log('iso', iso)
  const country = await Countries.findCountryByISO(iso)
  console.log('country', country)
  return country
}

module.exports = {
  getPercentChange,
  convertISOToCountry
}
