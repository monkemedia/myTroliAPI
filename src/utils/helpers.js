const getPercentChange = (current, previous) => {  
  return Math.round((((current - previous) / previous) * 100)) // .toFixed(2))
}

module.exports = {
  getPercentChange
}
