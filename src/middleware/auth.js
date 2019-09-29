const jwt = require('jsonwebtoken')
const Customer = require('../models/Customer')
const errorHandler = require('../utils/errorHandler')

const auth = async (req, res, next) => {
  let token = req.header('Authorization')

  if (!token) {
    return res.status(422).send(errorHandler(422, 'Token is required'))
  }

  token = token.replace('Bearer ', '')

  try {
    await jwt.verify(token, process.env.CLIENT_SECRET)

    const customer = await Customer.findOne({ _id: req.params.customerId })

    if (!customer) {
      throw errorHandler(422, 'Customer does\'t exists')
    }
    next()
  } catch (err) {
    if (err.message === 'jwt expired') {
      return res.status(422).send(errorHandler(422, 'Token has expired'))
    }

    res.status(err.status).send(err)
  }
}

module.exports = auth
