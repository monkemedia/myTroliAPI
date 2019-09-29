const httpError = require('http-errors')

module.exports = (statusCode, message) => {
  // let statusCode = 500
  // let message = error.message

  // if (error.response) {
  //   statusCode = error.response.status
  //   message = error.response.data.error
  // }
  return httpError(statusCode, message)
}
