const getPercentChange = (current, previous) => {  
  return parseFloat((((current - previous) / current) * 100).toFixed(2))
}

module.exports = {
  getPercentChange
}
