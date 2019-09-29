const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')

const auth = async (req, res, next) => {
  let token = req.header('Authorization')

  if (!token) {
    return res.status(422).send(errorHandler(422, 'Token is required'))
  }

  token = token.replace('Bearer ', '')

  try {
    await jwt.verify(token, process.env.CLIENT_SECRET)

    next()
  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(422).send(errorHandler(422, 'Token has expired'))
    }

    res.status(err.status).send(err)
  }
}

module.exports = auth
