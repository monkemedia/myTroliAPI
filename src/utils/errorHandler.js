const httpError = require('http-errors')

module.exports = (statusCode, err) => {
  // Returns correct error message when there are duplicated
  if (err.name === 'MongoError' && err.code === 11000) {
    const getDuplicateKey = err.errmsg.split('index: ')[1].split('_')[0]

    return httpError(statusCode, {
      message: `${getDuplicateKey.charAt(0).toUpperCase() + getDuplicateKey.slice(1)} needs to be unique`
    })
  }

  return httpError(statusCode, err)
}
