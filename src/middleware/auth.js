const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')

const auth = async (req, res, next) => {
  let token = req.header('Authorization')
  const tokenString = token.split(' ')[1]

  if (!token || tokenString === 'undefined' || !tokenString) {
    return res.status(401).send(errorHandler(401, 'Token is required'))
  }

  token = token.replace('Bearer ', '')

  try {
    jwt.verify(token, process.env.API_SECRET)

    next()
  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(401).send(errorHandler(401, 'Token has expired'))
    }

    res.status(err.status).send(err)
  }
}

module.exports = auth
